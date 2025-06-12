FROM node:22
WORKDIR /app/server

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .



# Create dist directory and set proper permissions
RUN mkdir -p dist && chown -R node:node /app/server

# Switch to non-root user
USER node

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]