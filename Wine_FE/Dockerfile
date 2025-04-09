# 1. Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 2. Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
