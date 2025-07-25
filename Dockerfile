FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev deps needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application using direct nuclear fix commands
RUN npx vite build && npx esbuild server/index-production.ts --bundle --platform=node --format=esm --outfile=dist/index.js --target=node18 --packages=external

# Remove dev dependencies after build to reduce image size
RUN npm prune --production

# Expose the port
EXPOSE 5000

# Start with the production server directly
CMD ["node", "dist/index.js"]