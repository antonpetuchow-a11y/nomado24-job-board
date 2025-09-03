# Use Node.js 18 Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (ohne Prisma)
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose port 5001 (wichtig für Cloud Run)
EXPOSE 5001

# Start the application
CMD ["node", "src/index.js"]