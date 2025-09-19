# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src ./src
RUN npm run build

# Runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
# Folder for server-published prompts/resources
RUN mkdir -p /app/prompts
COPY --from=build /app/dist ./dist
# Optional: prompts mounted via ConfigMap at /app/prompts (see k8s)
CMD ["node", "dist/server.js"]
EXPOSE 8080
