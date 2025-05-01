# Stage 1: Build
FROM node:23-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code and build
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

# Stage 2: Production image
FROM node:23-alpine AS runner

# Working directory inside the container
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy environment variables and JWT keys
COPY .env ./
COPY keys ./keys

# Copy build artifacts and Prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Expose application port (match the PORT in .env or default 3001)
EXPOSE 3001

# Start the application
CMD ["node", "dist/main"]
