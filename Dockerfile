# syntax=docker/dockerfile:1

# Pick the latest Node.js env from https://hub.docker.com/_/node
# with the latest LTS version of Debian (trixie).
FROM node:25-trixie

# Install packages to Linux OS.
# COMMENT OUT:
#   Pure Angular project doesn't need additional packages.
#   All dependencies are managed by NPM.
# RUN apt-get update

# Copy ./src/hello.js --> /app/hello/hello.js
WORKDIR /app/hello
COPY ./src/hello.js ./src/

CMD ["node", "./src/hello.js"]
