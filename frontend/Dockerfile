# Phase 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application and build
COPY . .
RUN npm run build

# Phase 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the custom nginx config into the image
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built files from the build phase
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

