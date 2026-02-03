# Dockerfile for React App (Create React App / Vite)

# ---------- Build Stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Build the application
# For CRA: creates 'build' folder
# For Vite: creates 'dist' folder
RUN npm run build

# ---------- Production Stage (Nginx) ----------
FROM nginx:alpine AS production

# Copy built assets from build stage
# For CRA (default):
# COPY --from=build /app/build /usr/share/nginx/html

COPY --from=build /app/dist /usr/share/nginx/html
# For Vite, replace above line with:
# COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx always runs on port 80 inside container
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ===== NOTE =====
# Nginx listens on port 80 internally (not configurable easily)
# Map to any host port you want:
#   docker run -p 8080:80 my-react-app  (access via localhost:8080)
#   docker run -p 3000:80 my-react-app  (access via localhost:3000)
#
# ===== USAGE =====
# Build: docker build -t my-react-app .
# Run: docker run -p 8080:80 my-react-app
