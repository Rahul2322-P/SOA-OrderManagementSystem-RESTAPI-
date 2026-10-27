# Multi-stage build for React Vite Frontend
# Stage 1: Build static assets
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy application source code
COPY . .

# Build argument for backend API URL (can be overridden during build)
ARG VITE_API_BASE_URL=http://localhost:8050
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build production bundles
RUN npm run build

# Stage 2: Serve through high-performance Nginx web server
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built distribution files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
