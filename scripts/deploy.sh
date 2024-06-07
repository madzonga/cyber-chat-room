#!/bin/bash

# Navigate to your project directory on the server
cd /path/to/your/project

# Pull the latest changes from the repository
git pull origin main

# Install dependencies
npm install

# Build the project
npm run build

# Restart the server (adjust this to fit your server setup)
pm2 restart all
