import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';
import { logger, generateRequestId } from '@/lib/logger';

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  const reqId = generateRequestId();
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      logger.warn('Unauthorized AI Copilot chat attempt', {}, reqId);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting: max 20 chat prompts per minute per user
    const rateCheck = checkRateLimit(`chat_${user.id}`, 20, 60 * 1000);
    if (!rateCheck.allowed) {
      logger.warn('AI Copilot chat rate limit exceeded', { userId: user.id }, reqId);
      return rateLimitResponse(rateCheck.resetSec);
    }

    const params = await props.params;
    const { id } = params;

    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ message: 'Message prompt is required' }, { status: 400 });
    }

    const videoRes = await query(
      `SELECT 
        v.id, v.title, v.status, v.user_id,
        t.content AS transcript_content, t.timestamps AS transcript_timestamps,
        s.short_summary, s.detailed_summary
      FROM videos v
      LEFT JOIN transcripts t ON v.id = t.video_id
      LEFT JOIN summaries s ON v.id = s.video_id
      WHERE v.id = $1`,
      [id]
    );

    if (videoRes.rows.length === 0) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }

    const video = videoRes.rows[0];
    if (video.user_id !== user.id) {
      logger.warn('Forbidden AI Copilot chat access attempt', { userId: user.id, videoId: id }, reqId);
      return NextResponse.json({ message: 'Unauthorized access to video' }, { status: 403 });
    }

    const transcriptContent = video.transcript_content || '';
    const timestampsData = video.transcript_timestamps || [];
    const shortSummary = video.short_summary || '';
    const detailedSummary = video.detailed_summary || '';

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const systemPrompt = `You are VisiCore AI Copilot, an enterprise video understanding assistant powered by Google Gemini 3.6 Flash.
You are analyzing the video titled "${video.title}".

Context Details:
- Short Summary: ${shortSummary}
- Detailed Summary: ${detailedSummary}
- Full Transcript: ${transcriptContent}
- Timestamps JSON: ${JSON.stringify(timestampsData)}

User Question: "${message.trim()}"

Rules for response:
1. Answer the question thoroughly based on the video transcript and summary context provided.
2. Whenever referencing moments in the video, include clickable timestamp tags in format [MM:SS] (e.g. [01:15], [00:42]).
3. Be professional, concise, and accurate.`;

        logger.info('Sending prompt to Gemini 3.6 Flash model', { videoId: id, promptLength: message.length }, reqId);

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: systemPrompt,
        });

        const reply = response.text ? response.text.trim() : null;
        if (reply) {
          logger.info('Gemini 3.6 Flash chat response received', { videoId: id }, reqId);
          return NextResponse.json({ reply }, { status: 200 });
        }
      } catch (geminiError) {
        logger.warn('Gemini 3.6 Flash call failed, utilizing context search fallback', { error: String(geminiError) }, reqId);
      }
    }

    // Context Search Fallback if GEMINI_API_KEY is not configured or rate limited
    let replyText = '';
    const lower = message.trim().toLowerCase();
    const parsedTs = Array.isArray(timestampsData) 
      ? timestampsData 
      : (typeof timestampsData === 'string' ? JSON.parse(timestampsData) : []);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const matches = parsedTs.filter((ts: { text: string }) => ts.text.toLowerCase().includes(lower));

    if (matches.length > 0) {
      replyText = `I found **${matches.length}** matching moment${matches.length > 1 ? 's' : ''} in "${video.title}":\n\n` +
        matches.map((m: { start: number; text: string }) => `• [${formatTime(m.start)}] — "${m.text}"`).join('\n\n');
    } else {
      replyText = `**Analysis for "${video.title}":**\n\n` +
        `**Summary:**\n${shortSummary || 'Summary processing complete.'}\n\n` +
        `**Detailed Notes:**\n${detailedSummary || 'Full analysis complete.'}\n\n` +
        (parsedTs.length > 0 
          ? `**Timeline Highlights:**\n` + parsedTs.slice(0, 5).map((ts: { start: number; text: string }) => `• [${formatTime(ts.start)}] ${ts.text}`).join('\n')
          : '');
    }

    return NextResponse.json({ reply: replyText }, { status: 200 });
  } catch (error: unknown) {
    logger.error('Video Copilot chat error', error, {}, reqId);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
