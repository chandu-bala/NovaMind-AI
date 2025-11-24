# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Copy full project into container
WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend
COPY backend/service-account.json ./backend/service-account.json

# Expose port used by Express
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start backend server
CMD ["node", "backend/server.js"]
