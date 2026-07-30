# 📹 VisiCore AI — Enterprise Video Understanding & Intelligence Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2%20(App%20Router)-black?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Google%20Gemini-3.6%20Flash-violet?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Cloudflare-R2%20Storage-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare R2" />
  <img src="https://img.shields.io/badge/RabbitMQ-Confirm%20Queue-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white" alt="RabbitMQ" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon%20DB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Azure-Container%20Apps-0089D6?style=for-the-badge&logo=microsoftazure&logoColor=white" alt="Azure Container Apps" />
</p>

---

## 📌 Executive Overview

**VisiCore AI** is a cloud-native, distributed **Enterprise Video Understanding and Semantic Intelligence Platform**. Designed for modern software engineering teams, media platforms, and data analysts, VisiCore AI transforms unstructured video assets into verbatim speech transcripts, second-by-second timestamp indexes, executive TL;DR summaries, and an interactive AI Copilot query engine powered by **Google Gemini 3.6 Flash**.

The platform is architected for extreme reliability and performance:
- **Direct Object Storage Uploads**: Browser uploads stream directly to **Cloudflare R2** via S3 presigned PUT URLs, completely bypassing Vercel serverless function payload limits (4.5 MB).
- **Zero-Loss Queue Dispatch**: Backend route handlers enforce **RabbitMQ Publisher Confirmations** (`createConfirmChannel()`) to guarantee message delivery under serverless execution constraints.
- **Resilient AI Processing**: Autonomous Python AI Workers running on **Azure Container Apps** poll the queue, perform multimodal inference, and stream byte-range playback data.
- **Linear-Grade UI/UX**: Built with React 19, Tailwind CSS v4, WebGL **React Bits Aurora** shader backgrounds, and a consistent 8px design token system.

---

## 📐 System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Browser (Next.js 16 + React 19)"]
        UI[Workspace UI / Dashboard]
        UploadComponent[Direct Browser Upload]
        Player[HTTP 206 Partial Stream Player]
    end

    subgraph Edge ["Serverless Edge (Vercel)"]
        InitAPI[POST /api/videos/upload/init]
        CompleteAPI[POST /api/videos/upload/complete]
        ChatAPI[POST /api/videos/id/chat]
        StreamAPI[GET /api/videos/id/stream]
    end

    subgraph Storage ["Cloud Infrastructure"]
        R2[(Cloudflare R2 Storage)]
        NeonDB[(Neon PostgreSQL)]
        CloudAMQP[[CloudAMQP RabbitMQ Queue]]
    end

    subgraph Worker ["Container Processing (Azure Container Apps)"]
        PyWorker[Python 3.11 AI Worker]
        Gemini[Google Gemini 3.6 Flash API]
    end

    UI -->|1. Request Presigned PUT| InitAPI
    InitAPI -->|Generate S3 Presigned URL| UI
    UploadComponent -->|2. Stream Video Bytes Directly| R2
    UI -->|3. Register Upload Complete| CompleteAPI
    CompleteAPI -->|4. Save Record| NeonDB
    CompleteAPI -->|5. Publish Task with ConfirmChannel| CloudAMQP
    CloudAMQP -->|6. Consume Task| PyWorker
    PyWorker -->|7. Read Object Stream| R2
    PyWorker -->|8. Multimodal Inference| Gemini
    PyWorker -->|9. Persist Transcript & Summaries| NeonDB
    UI -->|10. Stream Byte Range| StreamAPI
    StreamAPI -->|HTTP 206 Proxy| R2
    UI -->|11. Grounded Copilot Q&A| ChatAPI
    ChatAPI -->|Gemini Inference| Gemini
```

---

## ⚡ Data Flow Pipeline

```
1. Browser Ingestion
   └── User selects video asset → Requests presigned PUT URL from /api/videos/upload/init
   └── Browser uploads binary stream directly to Cloudflare R2 bucket (S3 API compatibility)
   └── Zero impact on Next.js serverless execution limits or memory footprint

2. Asynchronous Queue Dispatch
   └── User clicks "Upload Complete" → /api/videos/upload/complete records pending state in Neon PostgreSQL
   └── Next.js backend creates RabbitMQ ConfirmChannel & awaits publisher ACK
   └── Connections teardown cleanly before NextResponse returns

3. Autonomous AI Worker Processing
   └── Python AI Worker container on Azure receives message from `video_processing_queue`
   └── Worker retrieves object from R2 & uploads to Google Gemini 3.6 Flash Files API
   └── Gemini executes multimodal audio/visual analysis, producing verbatim transcripts & timestamps

4. Structured Persistence & Stream Indexing
   └── Worker saves JSON transcripts, timestamp arrays, short summary & detailed notes to PostgreSQL
   └── Video status transitions to `COMPLETED`
   └── Web client updates state via TanStack Query polling (5s interval)

5. Interactive Intelligence & Player
   └── User watches video via authenticated HTTP 206 Partial Content byte streaming proxy
   └── Interactive Copilot allows natural language Q&A with clickable timestamp links [02:15]
```

---

## 🛠️ Tech Stack & Key Components

### 🌐 Frontend & Web Application (`/web`)
- **Framework**: Next.js 16.2 (App Router, Server Actions, Route Handlers)
- **UI Engine**: React 19, Tailwind CSS v4, Lucide Icons, React Bits Aurora WebGL Shaders
- **State & Query**: Zustand (Stateless Auth Store), TanStack React Query v5 (Data Fetching & Auto-Polling)
- **HTTP & Storage**: Axios, AWS S3 Client SDK (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
- **Testing**: Vitest (`npm run test`), TypeScript (`npx tsc --noEmit`)

### 🐍 AI Worker & Backend Services (`/ai-worker`)
- **Runtime**: Python 3.11 (Azure Container App Docker Environment)
- **AI SDK**: Google GenAI SDK (`google-genai`), `gemini-3.6-flash`
- **Queueing & Database**: `pika` (RabbitMQ AMQP client with auto-reconnect), `psycopg2-binary` (PostgreSQL driver)
- **Object Storage**: MinIO Python SDK / S3 Client

---

## 🔐 Key REST API Endpoints

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | No | Registers new user account with hashed password |
| `/api/auth/login` | `POST` | No | Authenticates credentials and returns JWT bearer token |
| `/api/auth/me` | `GET` | Yes | Retrieves authenticated user profile and access role |
| `/api/auth/change-password` | `POST` | Yes | Updates current account password securely |
| `/api/videos` | `GET` | Yes | Lists all video assets owned by the user |
| `/api/videos/upload/init` | `POST` | Yes | Generates S3 presigned PUT URL for Cloudflare R2 upload |
| `/api/videos/upload/complete` | `POST` | Yes | Registers video in DB and dispatches task to RabbitMQ |
| `/api/videos/[id]` | `GET` | Yes | Fetches video details, transcript, timestamps, and summaries |
| `/api/videos/[id]` | `DELETE` | Yes | Permanently removes video asset and database record |
| `/api/videos/[id]/stream` | `GET` | Yes/Token | Proxies video byte stream with HTTP 206 partial content support |
| `/api/videos/[id]/chat` | `POST` | Yes | Grounded AI Copilot Q&A over video transcript context |

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0+
- **Python**: v3.11+
- **Docker & Docker Compose**: Installed for local PostgreSQL/RabbitMQ/MinIO stack
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com)

---

### 1. Clone Repository & Setup Environment

```bash
git clone https://github.com/AbhirupBhowmick/VisiCore-AI.git
cd VisiCore-AI
```

#### Web Application Configuration (`web/.env.local`):
```env
DATABASE_URL="postgresql://admin:password@localhost:5432/aivideodb?schema=public"
JWT_SECRET="your-super-secret-jwt-key"

R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-cloudflare-r2-access-key"
R2_SECRET_ACCESS_KEY="your-cloudflare-r2-secret-key"
R2_BUCKET_NAME="aivideo"

RABBITMQ_URL="amqp://guest:guest@localhost:5672"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

#### AI Worker Configuration (`ai-worker/.env`):
```env
GEMINI_API_KEY="your-google-gemini-api-key"
RABBITMQ_URL="amqp://guest:guest@localhost:5672"
DATABASE_URL="postgresql://admin:password@localhost:5432/aivideodb?schema=public"
MINIO_ENDPOINT="localhost:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="aivideo"
MINIO_SECURE="false"
```

---

### 2. Launch Local Backing Services (Docker)

```bash
docker-compose up -d
```

- **PostgreSQL**: `localhost:5432` (`aivideodb`)
- **RabbitMQ Dashboard**: `http://localhost:15672` (`guest` / `guest`)
- **MinIO Console**: `http://localhost:9001` (`minioadmin` / `minioadmin`)

---

### 3. Start Fullstack Web Application

```bash
cd web
npm install
npm run test
npm run dev
```

The web application will be live at `http://localhost:3000`.

---

### 4. Start Python AI Worker

```bash
cd ai-worker
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python worker.py
```

The worker container will connect to RabbitMQ and print:
`[*] Waiting for videos on 'video_processing_queue'. To exit press CTRL+C`

---

## 🧪 Verification & Quality Control

Execute static type checking, unit tests, and production Next.js build verification:

```bash
# In /web directory
npx tsc --noEmit      # TypeScript static type check (0 errors)
npm run test          # Vitest suite (16/16 tests passing)
npm run build         # Production Next.js build compilation
```

---

## 📜 License

This project is licensed under the **MIT License**.

&copy; 2026 VisiCore AI Inc. Precision Video Intelligence.
