 

# Set the base image to node:latest
FROM node:latest as build-stage

# Create and set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the app files to the container
COPY . .

# Build the app
RUN npm run build

# Create a new stage with the Nginx image
FROM nginx:latest

# Copy the build files to the Nginx container
COPY --from=build-stage /app/build /usr/share/nginx/html

# Copy the Nginx configuration file to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
