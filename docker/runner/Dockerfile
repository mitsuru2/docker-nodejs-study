# syntax=docker/dockerfile:1

# Self-hosted GitHub Actions runner image, executed on Azure Container Instances (ACI).
# Built and pushed to ACR by .github/workflows/build-runner-image.yml (on GitHub-hosted runner,
# since this image cannot be used to build itself).
#
# Node.js / Angular CLI are baked in directly so that lint/test jobs run `npm ci && npm run lint|test`
# without Docker-in-Docker (ACI does not support privileged containers).
FROM node:24-trixie

# Bump this when GitHub enforces a new minimum runner version.
# https://github.com/actions/runner/releases
ARG RUNNER_VERSION=2.329.0

# git/sudo: same as the app's own Dockerfile.
# curl/jq/unzip/ca-certificates: required to download and configure the runner.
# build-essential/python3: fallback for native npm deps without a linux-x64 prebuilt binary.
# lsb-release/gnupg: required by the Azure CLI install script.
RUN apt-get update && apt-get install -y \
    curl \
    jq \
    git \
    ca-certificates \
    unzip \
    sudo \
    build-essential \
    python3 \
    lsb-release \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Azure CLI: required by manual-release-build.yml / docker-publish.yml steps that call `az`
# (including `az acr build`, which replaces `docker build` since ACI cannot run Docker-in-Docker).
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# Enable sudo for the 'node' user w/o password (some workflow steps run e.g. `sudo apt-get install`).
RUN mkdir -p /etc/sudoers.d \
    && echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node

# Download and extract the GitHub Actions runner.
WORKDIR /actions-runner
RUN curl -o actions-runner-linux-x64.tar.gz -L \
    "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz" \
    && tar xzf actions-runner-linux-x64.tar.gz \
    && rm actions-runner-linux-x64.tar.gz \
    && ./bin/installdependencies.sh \
    && chown -R node:node /actions-runner

COPY --chown=node:node entrypoint.sh /actions-runner/entrypoint.sh
RUN chmod +x /actions-runner/entrypoint.sh

USER node

# REPO_URL / RUNNER_TOKEN / RUNNER_NAME / RUNNER_LABELS are injected by the Controller function
# as ACI container group environment variables. See ../../.github/workflows for the workflows
# that run on this image, and tech-portfolio-runner (separate bicep-study repo) for the controller.
ENTRYPOINT ["/actions-runner/entrypoint.sh"]
