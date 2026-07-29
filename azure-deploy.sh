#!/usr/bin/env bash
# ─── VisiCore AI Azure Deployment Helper Script ──────────────────────────────
set -e

RESOURCE_GROUP=${AZURE_RESOURCE_GROUP:-"visicore-rg"}
LOCATION=${AZURE_LOCATION:-"eastus"}
ACR_NAME=${AZURE_ACR_NAME:-"visicorecr"}
APP_SERVICE_PLAN=${AZURE_APP_PLAN:-"visicore-plan"}
WEB_APP_NAME=${AZURE_WEB_APP:-"visicore-web"}
WORKER_APP_NAME=${AZURE_WORKER_APP:-"visicore-worker"}

echo "🚀 Preparing VisiCore AI deployment to Azure..."
echo "Resource Group: $RESOURCE_GROUP ($LOCATION)"

# 1. Create Resource Group
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" || true

# 2. Create Azure Container Registry
az acr create --resource-group "$RESOURCE_GROUP" --name "$ACR_NAME" --sku Basic --admin-enabled true || true

# 3. Build & Push Web Docker Image
echo "📦 Building Web container..."
az acr build --registry "$ACR_NAME" --image visicore-web:latest ./web

# 4. Build & Push AI Worker Docker Image
echo "📦 Building AI Worker container..."
az acr build --registry "$ACR_NAME" --image visicore-worker:latest ./ai-worker

echo "✅ Azure container builds finished!"
echo "To finish deployment, configure your environment variables (DATABASE_URL, GEMINI_API_KEY, RABBITMQ_URL, MINIO_URL) in Azure App Service and Container Apps."
