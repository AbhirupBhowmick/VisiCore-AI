# 📹 VisiCore AI — Enterprise Video Understanding Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15%2B-blue?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4%2B-green?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Python-3.9%2B-blue?style=for-the-badge&logo=python&logoColor=yellow" alt="Python" />
  <img src="https://img.shields.io/badge/PostgreSQL-15%2B-blue?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/RabbitMQ-3%2B-orange?style=for-the-badge&logo=rabbitmq&logoColor=white" alt="RabbitMQ" />
  <img src="https://img.shields.io/badge/Google%20Gemini-AI-violet?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini" />
</p>

VisiCore AI is a next-generation, high-performance **Enterprise AI Video Understanding & Semantic Indexing Platform**. Built with a state-of-the-art modern software architecture, VisiCore AI transcribes, indexes, and analyzes multi-format video feeds using Google Gemini AI, offering context-aware timeline queries, high-fidelity summaries, and interactive Copilot chats.

---

## 🌟 Key Features

*   **⚡ Real-Time Video Ingestion**: Securely upload large video files through standard multipart streams.
*   **🧠 Gemini-Powered Telemetry**: Automatic video transcription, scene mapping, and visual summary generations powered by `gemini-2.5-flash`.
*   **💬 Gemma 4 Copilot**: Context-aware chat assistant that lets you query specific moments, ask contextual questions, and retrieve exact clickable timestamps to seek directly in the video.
*   **⏱️ Interactive Visual Timelines**: Clickable semantic timestamps mapped directly to video timestamps for instant timeline navigation.
*   **⚙️ Scalable Microservice Architecture**: Decoupled asynchronous worker queue structure to process multiple parallel ingestion pipelines.
*   **🌌 Modern Premium UI**: High-fidelity Glassmorphic Dark UI featuring tailored micro-animations, active transforms, and stable layout designs.

---

## 📐 Platform Architecture

VisiCore AI is structured as a robust multi-service environment:

```mermaid
graph TD
    User([User Client Browser]) -->|Next.js App Router| Frontend[Next.js Frontend]
    Frontend -->|REST APIs| Backend[Spring Boot REST API]
    Backend -->|Metadata / Auth| DB[(PostgreSQL)]
    Backend -->|Video Store| Storage[(Supabase Storage S3)]
    Backend -->|Queue Task| MQ[[CloudAMQP RabbitMQ]]
    MQ -->|Consume Message| Worker[Python AI Worker]
    Worker -->|Read Video Object| Storage
    Worker -->|Deep Analysis| Gemini[Google Gemini 2.5 API]
    Worker -->|Save Transcripts / Summaries| DB
```

1.  **Frontend (`/web`)**: Next.js App Router, Tailwind CSS, TypeScript, TanStack Query, Lucide icons, and Zustand for state management. *Deployed on Vercel.*
2.  **Backend API (`/api`)**: Java Spring Boot, Spring Security (JWT auth), Spring Data JPA, PostgreSQL, MinIO SDK, and RabbitTemplate. *Deployed on Render.*
3.  **AI Worker (`/ai-worker`)**: Python 3, Google GenAI SDK, RabbitMQ (`pika`), MinIO, and `psycopg2` for direct database result storage. *Runs locally or as a cloud background process.*

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have the following installed on your system:
*   **Docker & Docker Compose**
*   **Java 21+ & Maven**
*   **Node.js 18+ (npm/pnpm/yarn)**
*   **Python 3.9+**
*   **Google Gemini API Key** (Get yours from [aistudio.google.com](https://aistudio.google.com))

---

### 1. Ingest Infrastructure (Docker)
Launch the backing databases, queues, and object storage:
```bash
docker-compose up -d
```
*   **MinIO Console**: `http://localhost:9001` (Credentials: `minioadmin` / `minioadmin`)
*   **RabbitMQ Dashboard**: `http://localhost:15672` (Credentials: `guest` / `guest`)
*   **PostgreSQL**: `localhost:5432` (`aivideodb` / `admin` / `password`)

---

### 2. Configure & Start Backend API (Spring Boot)
1.  Configure credentials in `api/src/main/resources/application.yml` (if needed).
2.  Start the API server:
```bash
cd api
./mvnw spring-boot:run
```
*   **API Server Endpoint**: `http://localhost:8080`

---

### 3. Start Python AI Worker
1.  Navigate to the worker folder:
```bash
cd ai-worker
```
2.  Initialize virtual environment and install dependencies:
```bash
source venv/bin/activate
pip install -r requirements.txt
```
3.  Configure your environment variables in a `.env` file inside the `ai-worker/` folder (see template below).
4.  Start the worker process:
```bash
python worker.py
```

---

### 4. Start Next.js Web Dashboard
1.  Navigate to the web folder:
```bash
cd web
```
2.  Install client dependencies:
```bash
npm install
```
3.  Start the Next.js development server:
```bash
npm run dev
```
*   **Web UI Dashboard**: `http://localhost:3000`

---

## 🌐 Production Cloud Deployment Reference

Here are the environment variables configured for our live production stack:

### 🛡️ Next.js Web Dashboard (Vercel)
*   `NEXT_PUBLIC_API_URL`: Your Render backend API endpoint
*   `NEXT_PUBLIC_SUPABASE_URL`: `https://wjiwpypsdmcyhxkavmmz.supabase.co`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public API key

### ☕ Spring Boot API (Render)
*   `SPRING_DATASOURCE_URL`: PostgreSQL connection string
*   `SPRING_DATASOURCE_USERNAME`: database username
*   `SPRING_DATASOURCE_PASSWORD`: database password
*   `SPRING_RABBITMQ_ADDRESSES`: CloudAMQP amqps addresses
*   `SPRING_RABBITMQ_SSL_ENABLED`: `true`
*   `MINIO_URL`: Supabase project URL (`https://wjiwpypsdmcyhxkavmmz.supabase.co`)
*   `MINIO_ACCESS_KEY`: Supabase S3 Access Key ID
*   `MINIO_SECRET_KEY`: Supabase S3 Secret Access Key
*   `MINIO_BUCKET`: `aivideo`

### 🐍 Python AI Worker (`.env` Config)
```env
GEMINI_API_KEY=AIzaSy...
DATABASE_URL=postgresql://...
RABBITMQ_URL=amqps://...
MINIO_ENDPOINT=wjiwpypsdmcyhxkavmmz.supabase.co
MINIO_ACCESS=27ebe3df2da1b6d1d93880d02ec48524
MINIO_SECRET=ecbdb3ed17be99386b1883cc751325cba1728ed6d90589c8ad9cf7068df9c4ed
MINIO_BUCKET=aivideo
MINIO_SECURE=true
```

---

## 🔒 Security & Best Practices
*   **Secure Credential Normalization**: Custom database credential parsing that extracts inline credentials from dynamic cloud PostgreSQL URLs to prevent Java JDBC connection crashes.
*   **Decoupled Secret Storage**: Secure `.env` environment isolation prevents any leaks of valuable API keys during repository commits.
*   **Secure Queue Channels**: AMQPS SSL wrapper protocols enabled in production to encrypt pipeline traffic between backend processes.
