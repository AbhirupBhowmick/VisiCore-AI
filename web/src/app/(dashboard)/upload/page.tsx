"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, CheckCircle, AlertCircle, FileVideo, Sparkles, ChevronRight, Video, FileText } from 'lucide-react';
import api from '../../../lib/api';
import Link from 'next/link';

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('video/')) {
      setStatus('error');
      setErrorMsg('Please upload a valid video file (e.g. MP4, WebM, MOV).');
      return;
    }
    setFile(selectedFile);
    setStatus('idle');
    setErrorMsg('');
  };

  const triggerFileInput = () => {
    if (status === 'idle' && !file) {
      fileInputRef.current?.click();
    }
  };

  const uploadFile = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering file selection dialog
    if (!file) return;
    
    setStatus('uploading');
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      await api.post('/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      
      setStatus('success');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Failed to upload video stream. Please check connection.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto min-h-[75vh] flex flex-col justify-center font-sans">
      
      {/* Title block */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-400 mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Core Processing Engine
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Upload Video Feed</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">Drop raw video assets directly into our pipeline to perform asynchronous semantic indexing, speaker classification, and smart summarize.</p>
      </div>

      {/* Main Drag-Drop Interface Container */}
      <div 
        onClick={triggerFileInput}
        className={`relative border border-dashed rounded-2xl p-10 md:p-16 transition-all duration-300 flex flex-col items-center justify-center min-h-[380px] overflow-hidden shadow-xl
          ${status === 'idle' && !file ? 'cursor-pointer hover:border-gray-700' : ''}
          ${isDragging ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'border-[#262626] bg-[#0A0A0A]'}
          ${status === 'uploading' ? 'pointer-events-none opacity-90' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Background detection matrix design */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <input 
          ref={fileInputRef}
          type="file" 
          accept="video/*" 
          onChange={handleFileInput}
          className="hidden"
          disabled={status === 'uploading' || status === 'success'}
        />

        {/* State: Idle & No File */}
        {status === 'idle' && !file && (
          <div className="flex flex-col items-center text-center relative z-20">
            <div className="w-20 h-20 bg-blue-500/5 border border-[#262626] rounded-2xl flex items-center justify-center mb-6 shadow-md transition-transform duration-300">
              <UploadCloud className="w-10 h-10 text-blue-500 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Drag and drop your file here</h3>
            <p className="text-gray-500 mb-6 text-sm">MP4, WebM, or MOV formats (Up to 2GB)</p>
            <span className="bg-[#141414] border border-[#262626] text-white px-5 py-2.5 rounded-xl hover:bg-[#1a1a1a] transition-all font-medium text-sm">
              Browse Local Assets
            </span>
          </div>
        )}

        {/* State: Idle & File Selected */}
        {status === 'idle' && file && (
          <div className="flex flex-col items-center w-full max-w-md text-center z-20 pointer-events-auto">
             <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <FileVideo className="w-10 h-10 text-blue-500" />
             </div>
             <h3 className="text-lg font-semibold text-white mb-1.5 truncate w-full px-4">{file.name}</h3>
             <p className="text-gray-400 mb-8 text-xs font-mono">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
             
             <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
               <button 
                 onClick={uploadFile}
                 className="w-full sm:flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.25)] hover:shadow-[0_0_25px_rgba(37,99,235,0.45)] flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98] outline-none cursor-pointer"
               >
                 Start AI Analysis
                 <ChevronRight className="w-4 h-4" />
               </button>
               <button 
                 onClick={(e) => { 
                   e.stopPropagation(); 
                   setFile(null); 
                   setStatus('idle'); 
                   if (fileInputRef.current) fileInputRef.current.value = '';
                 }}
                 className="w-full sm:flex-1 h-12 bg-[#141414] hover:bg-[#1e1e1e] border border-[#262626] hover:border-gray-700 text-gray-400 hover:text-white transition-all font-semibold text-sm rounded-xl flex items-center justify-center whitespace-nowrap active:scale-[0.98] outline-none cursor-pointer"
               >
                 Cancel
               </button>
             </div>
          </div>
        )}

        {/* State: Uploading progress */}
        {status === 'uploading' && (
          <div className="w-full max-w-md flex flex-col items-center z-20">
            <div className="text-blue-400 font-bold mb-4 text-2xl tracking-tight">{uploadProgress}%</div>
            
            {/* Sleek full progress track */}
            <div className="w-full h-3 bg-[#000000] rounded-full overflow-hidden border border-[#262626]">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            
            <h4 className="text-gray-400 mt-5 text-sm font-medium truncate w-full text-center px-4">Processing media packets...</h4>
            <p className="text-gray-600 mt-1.5 text-xs truncate max-w-xs">{file?.name}</p>
          </div>
        )}

        {/* State: Success redirect */}
        {status === 'success' && (
          <div className="flex flex-col items-center z-20 text-center">
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Upload Successful</h3>
            <p className="text-gray-400 text-sm">Dispatched video stream context to RabbitMQ. Redirecting to workspace...</p>
          </div>
        )}

        {/* State: Error */}
        {status === 'error' && (
          <div className="flex flex-col items-center z-20 text-center max-w-md pointer-events-auto">
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Understanding Pipeline Failed</h3>
            <p className="text-red-400/90 text-sm mb-8 leading-relaxed">{errorMsg}</p>
             <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setFile(null); 
                  setStatus('idle'); 
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="h-12 px-8 bg-[#141414] hover:bg-[#1e1e1e] border border-[#262626] text-white font-semibold text-sm rounded-xl hover:border-gray-700 transition-all active:scale-[0.98] outline-none cursor-pointer"
              >
                Configure & Try Again
              </button>
          </div>
        )}

      </div>
    </div>
  );
}
