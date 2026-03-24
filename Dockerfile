# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source
COPY . .

# Build the application
RUN npm run build

# ─── Stage 2: Production ─────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install production-only dependencies
RUN npm install --omit=dev

# Copy built output
COPY --from=builder /app/dist ./dist

# Copy other necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/index.html ./

# Expose the port
EXPOSE 8888

# Start the application
CMD ["npm", "run", "preview"]
