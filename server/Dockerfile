# Use Node.js 20 Alpine as the base image for a small footprint
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
# Using 'npm ci' ensures a clean, repeatable install from the lockfile
RUN npm ci --only=production

# Copy the rest of the application source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD [ "node", "index.js" ]
