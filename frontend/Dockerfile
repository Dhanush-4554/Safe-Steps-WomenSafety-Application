# frontend/Dockerfile

# Use the official Node.js image
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use an Nginx image to serve the static files
FROM nginx:alpine

# Copy the build files to the Nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that Nginx runs on
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
