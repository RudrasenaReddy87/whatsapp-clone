#!/usr/bin/env bash
# exit on error
set -o errexit

echo "🔧 Starting build process..."

echo "📦 Installing frontend dependencies..."
cd frontend
npm ci --only=production=false
echo "🏗️ Building frontend..."
npm run build
cd ..

echo "📦 Installing backend dependencies..."
cd backend
npm ci --only=production
echo "✅ Build completed successfully!"