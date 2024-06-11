#!/bin/bash

# Navigate to the project directory on the server
cd /path/to/your/project

# Pull the latest changes from the repository
git pull origin main

# Install dependencies
npm install

# Build the project
npm run build

# Restart the server 
pm2 restart all
