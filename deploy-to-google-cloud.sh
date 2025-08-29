#!/bin/bash

# Google Cloud Deployment Script for Nomado24 Job Board
# Make sure you have gcloud CLI installed and configured

echo "🚀 Starting Google Cloud Deployment for Nomado24 Job Board..."

# Set your project ID (replace with your actual project ID)
PROJECT_ID="your-google-cloud-project-id"
REGION="europe-west1"
SERVICE_NAME="nomado24-backend"

echo "📋 Project ID: $PROJECT_ID"
echo "🌍 Region: $REGION"
echo "🔧 Service Name: $SERVICE_NAME"

# Build and push Docker image
echo "🐳 Building and pushing Docker image..."
cd server
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME .
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
echo "☁️ Deploying to Google Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 5001 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production

echo "✅ Deployment completed!"
echo "🌐 Your backend is now running on Google Cloud Run"
echo "🔗 Check the URL in the output above"
echo ""
echo "📝 Next steps:"
echo "1. Set up PostgreSQL on Google Cloud SQL"
echo "2. Configure environment variables"
echo "3. Set up custom domain for API"
echo "4. Update frontend with new API URL"
