# ---------- Build Stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Accept build arguments
ARG VITE_SERVER_BASE_URL
ARG VITE_API_BASE_URL

# Set environment variables for the build process
ENV VITE_SERVER_BASE_URL=${VITE_SERVER_BASE_URL}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the application
# For CRA: creates 'build' folder
# For Vite: creates 'dist' folder
RUN npm run build

# ---------- Production Stage (Nginx) ----------
FROM nginx:alpine AS production

# Copy built assets from build stage
# For CRA (default):
# COPY --from=build /app/build /usr/share/nginx/html

# For Vite (default in your Dockerfile):
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx always runs on port 80 inside container
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
