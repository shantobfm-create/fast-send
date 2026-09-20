FROM node:20-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies and build both frontends
RUN cd hybrid-app && npm install && npm run build
RUN cd admin-portal && npm install && npm run build
RUN cd backend && npm install

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "backend/server.js"]
