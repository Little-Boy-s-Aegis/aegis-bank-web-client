# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Upgrade Alpine OS packages to patch OpenSSL/libcrypto3 CVEs
RUN apk update && apk upgrade --no-cache

# Copy Next.js standalone server and static files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Harden container: delete package.json and pre-installed package managers (npm, yarn, corepack) to eliminate all transitively bundled CVEs
RUN rm -f package.json && \
    rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/lib/node_modules/corepack \
           /opt/yarn-v1.22.22 \
           /usr/local/bin/npm \
           /usr/local/bin/npx \
           /usr/local/bin/yarn \
           /usr/local/bin/yarnpkg

EXPOSE 3000
CMD ["node", "server.js"]
