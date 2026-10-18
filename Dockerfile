# Build stage: VITE_MAPS_API_KEY is baked into the JS bundle at build time
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_MAPS_API_KEY=""
RUN VITE_MAPS_API_KEY="$VITE_MAPS_API_KEY" npm run build

# Runtime stage: static files served by a non-root nginx on port 8080 (Cloud Run's default)
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
