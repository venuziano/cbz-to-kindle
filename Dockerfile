# Use the Node.js base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy only package files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the development server port
EXPOSE 3000

# Command to run Next.js in development mode
CMD ["npm", "run", "dev"]