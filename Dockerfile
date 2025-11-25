FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend

# ✅ Copy your service account file
COPY backend/service-account.json /app/service-account.json

# ✅ Tell Google SDK where credentials are
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/service-account.json

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "backend/server.js"]
