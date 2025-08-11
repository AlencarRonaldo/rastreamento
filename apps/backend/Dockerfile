# ===========================================
# MULTI-STAGE DOCKERFILE FOR VEHICLE TRACKING BACKEND
# ===========================================
# Optimized Node.js 18 Alpine build for production

# ===========================================
# STAGE 1: Base Dependencies
# ===========================================
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    postgresql-client \
    curl \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

# ===========================================
# STAGE 2: Development Dependencies
# ===========================================
FROM base AS deps

# Install dependencies (including dev dependencies for build)
RUN npm ci --include=dev --frozen-lockfile

# Generate Prisma client
RUN npx prisma generate

# ===========================================
# STAGE 3: Production Dependencies
# ===========================================
FROM base AS production-deps

# Install only production dependencies
RUN npm ci --omit=dev --frozen-lockfile && npm cache clean --force

# Generate Prisma client for production
RUN npx prisma generate

# ===========================================
# STAGE 4: Build Application
# ===========================================
FROM deps AS build

# Copy source code
COPY . .

# Build TypeScript application
RUN npm run build

# Remove development dependencies after build
RUN npm prune --production

# ===========================================
# STAGE 5: Production Runtime
# ===========================================
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    dumb-init \
    postgresql-client \
    curl \
    tini \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV GPS_TCP_PORT=5001
ENV GPS_UDP_PORT=5002

# Copy built application
COPY --from=build --chown=backend:nodejs /app/dist ./dist
COPY --from=build --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=backend:nodejs /app/package*.json ./
COPY --from=build --chown=backend:nodejs /app/prisma ./prisma

# Create required directories
RUN mkdir -p logs uploads && chown -R backend:nodejs logs uploads

# Switch to non-root user
USER backend

# Expose ports
# 3001 - REST API and Socket.IO
# 5001 - GPS TCP Server
# 5002 - GPS UDP Server
EXPOSE 3001 5001 5002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/server.js"]

# ===========================================
# STAGE 6: Development Runtime
# ===========================================
FROM deps AS development

# Install development tools
RUN npm install -g nodemon tsx

# Create non-root user
RUN addgroup -g 1001 -S nodejs || true
RUN adduser -S backend -u 1001 || true

# Set working directory
WORKDIR /app

# Copy source code
COPY --chown=backend:nodejs . .

# Create required directories
RUN mkdir -p logs uploads && chown -R backend:nodejs logs uploads

# Set environment variables
ENV NODE_ENV=development
ENV LOG_LEVEL=debug

# Switch to non-root user
USER backend

# Expose ports
EXPOSE 3001 5001 5002

# Start in development mode with hot reload
CMD ["npm", "run", "dev"]

# ===========================================
# BUILD ARGUMENTS AND LABELS
# ===========================================
# Build arguments
ARG BUILD_DATE
ARG BUILD_VERSION
ARG BUILD_REVISION

# Image labels
LABEL maintainer="Vehicle Tracking Team"
LABEL org.label-schema.name="vehicle-tracking-backend"
LABEL org.label-schema.description="Backend API and GPS Server for Vehicle Tracking System"
LABEL org.label-schema.build-date=$BUILD_DATE
LABEL org.label-schema.version=$BUILD_VERSION
LABEL org.label-schema.vcs-ref=$BUILD_REVISION
LABEL org.label-schema.schema-version="1.0"

# SuperClaude integration labels
LABEL superclaude.framework="true"
LABEL superclaude.version="3.0.0"
LABEL superclaude.personas="backend,gps-architect,data"
LABEL superclaude.features="gps-tcp-server,rest-api,websocket-gateway,real-time-processing,notification-service"