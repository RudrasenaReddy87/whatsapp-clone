#!/bin/bash

# Exit on error
set -e

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Install backend dependencies
cd backend
npm install
