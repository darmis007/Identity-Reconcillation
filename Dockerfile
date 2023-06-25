# Use the official Node.js 14.x Docker image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code
RUN npx tsc

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["node", "src/app.js"]
