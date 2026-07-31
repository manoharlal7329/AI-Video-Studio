FROM node:18-bullseye-slim

WORKDIR /app

# Install OS-level dependencies required for video processing (ffmpeg)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Create temp directory for storing output videos
RUN mkdir -p temp
RUN chown -R node:node temp

ENV NODE_ENV production
ENV PORT 5000

USER node

EXPOSE 5000

CMD ["npm", "start"]
