# Use Node.js 18 Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only express
RUN npm install express

# Copy source code
COPY . .

# Expose port
EXPOSE 5001

# Start the application
CMD ["node", "src/index.js"]