#!/usr/bin/env bash
# exit on error
set -o errexit

echo "📦 Building Frontend (React 19 + Vite)..."
cd frontend
npm install
npm run build
cd ..

echo "🐍 Installing Python Dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Build Complete! Ready for Uvicorn startup."
