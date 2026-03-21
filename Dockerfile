# syntax=docker/dockerfile:1

# Use latest LTS version of Node.js on Debian.
# You can check the latest versions on the following links:
# - Docker Hub (Node.js): https://hub.docker.com/_/node
# - Node.js: https://nodejs.org/ja/about/previous-releases
# - Debian: https://wiki.debian.org/DebianReleases#Current_Debian_Releases_and_repositories
FROM node:24-trixie AS build

# Install OS-level dependencies.
# - Git: It should be installed to use git commands in container or via VSCode remote 
#        development extension.
# Note: After installing packages, we clean up the apt cache to reduce the image size.
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Working directory in the container. This is where your application code will be located.
# '/app' is a common convention, but you can choose any directory name you prefer.
WORKDIR /app

# Copy package.json and package-lock.json to the working directory, and install packages.
# DON'T use 'npm install' to prevent installing unintended latest versions of packages
# as Angular has very sensitive version dependencies.
COPY package*.json ./
RUN npm ci

# DON'T copy the source code to the image because it's be mounted when the container running.
# COPY . .

# Mark that the container listen on following ports.
# DON'T FORGET to specify -p options when running the container to map these ports to your host machine.
# 4200: Angular development server port.
EXPOSE 4200

# Build the application. 
CMD ["npm", "run", "build"]

# Start the application. (disabled)
# Added --host 0.0.0.0 to allow access from outside the container.
# CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]

# ---- STAGE 2: runtime ----
FROM node:24-trixie-slim AS runtime
WORKDIR /app

# Copy package.json and package-lock.json to the working directory, and install packages.
# Here, it installs only production dependencies.
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy all files under 'dist' folder.
COPY --from=build /app/dist ./dist

# Launch SSR server by Node.js
CMD ["node", "dist/docker-nodejs-study/server/server.mjs"]


