# Use Node.js 20 Alpine
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Use npm start to follow the package.json main entry point
CMD [ "npm", "start" ]
