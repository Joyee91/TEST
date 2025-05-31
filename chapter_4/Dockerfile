# This will act as an instruction sheet of how to build the docker container and get the app up and running (even for devices with different operating systems)

# This is for a Single Docker Container

# Use an official node.js runtime as a parent image (a snapshot of the environment specified)
FROM node:22-alpine

# Set working directory in the container
WORKDIR /app

# Copy files from local project into this environment (package.json and package-lock.json)
COPY package*.json .
# this copies all json files that has package in the file name into the docker working directory

# Install all necessary npm packages (dependencies)
RUN npm install

# Copy the rest of the application code (all source code)
COPY . .
# from current file to current working directory inside docker environment
# separating the 2 copy command is so that when we make changes to the source code, docker will just have to rebuild the second copy and not having to reinstall all the packages everytime there's changes to the source code

# Expose the port that the app runs on
EXPOSE 5000
# need this to be able to connect the real environment to the docker environment so we can send netowrk requests to the docker environment

# Define the command to run your application
CMD ["node", "./src/server.js"]