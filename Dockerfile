# syntax=docker/dockerfile:1

# Development image shared by the Dev Container (local), GitHub Actions CI and
# Copilot cloud agent. Every environment builds it from this file with buildx and
# reads the build cache from GHCR, so keep it free of anything that changes often.
#
# Base image: Node.js LTS on Debian, pinned by patch version and digest so that the
# GHCR build cache stays valid and every environment gets the same Node.js / npm.
# Dependabot (docker ecosystem) opens a PR when a new digest is published.
# To get the digest: docker buildx imagetools inspect node:<version>-trixie
# 
# You can check the latest versions on the following links:
# - Docker Hub (Node.js): https://hub.docker.com/_/node
# - Node.js: https://nodejs.org/ja/about/previous-releases
# - Debian: https://wiki.debian.org/DebianReleases#Current_Debian_Releases_and_repositories
FROM node:24.22.1-trixie@sha256:7e9fb4d8acb6f7b3b824f65bf30c076685861362cd18e1d40f6197e5b411fb71


# Development user. The name is the same in every project regardless of the base
# image, so devcontainer.json, sudoers and mount paths can be shared as they are.
# UID/GID stay 1000 to match the default WSL user, so files in the bind-mounted
# repository keep the same owner inside and outside the container.
ARG USERNAME=dev
ARG USER_UID=1000
ARG USER_GID=1000


# Normalize the UID/GID 1000 user to ${USERNAME}, whatever the base image is:
# - It exists under another name (node: 'node', ubuntu: 'ubuntu') -> rename it and
#   move its home to /home/${USERNAME}.
# - It does not exist (python, golang, debian, ...) -> create it.
# Keep this block first so everything below can refer to ${USERNAME}.
# Alpine-based images need 'apk add shadow' before this for usermod/groupmod.
RUN set -eux; \
    old_group="$(getent group "${USER_GID}" | cut -d: -f1 || true)"; \
    if [ -z "${old_group}" ]; then \
        groupadd -g "${USER_GID}" "${USERNAME}"; \
    elif [ "${old_group}" != "${USERNAME}" ]; then \
        groupmod -n "${USERNAME}" "${old_group}"; \
    fi; \
    old_user="$(getent passwd "${USER_UID}" | cut -d: -f1 || true)"; \
    if [ -z "${old_user}" ]; then \
        useradd -m -s /bin/bash -u "${USER_UID}" -g "${USER_GID}" "${USERNAME}"; \
    elif [ "${old_user}" != "${USERNAME}" ]; then \
        usermod -l "${USERNAME}" -d "/home/${USERNAME}" -m -g "${USER_GID}" "${old_user}"; \
    fi


# Install OS-level dependencies.
# - git: Used in the container and by the VS Code remote development extension.
# - sudo: Only to let user 'node' run the firewall script as root (see below).
# - iptables/ipset/dnsutils/jq: Required by scripts/init-firewall.sh to restrict
#   outbound network access to an allowlist.
# - gnupg: Required to import the GitHub CLI apt repository signing key below.
# - zip (removed): Test evidence is not packaged here: CI saves reports and E2E
#   traces as workflow artifacts.
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    sudo \
    gnupg \
    iptables \
    ipset \
    dnsutils \
    jq \
    && rm -rf /var/lib/apt/lists/*


# Install GitHub CLI (gh). Not version-pinned on purpose: it is only used locally for
# fetching issues and creating PRs, and does not affect test results.
# Official install instructions: https://github.com/cli/cli/blob/trunk/docs/install_linux.md
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg -o /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" > /etc/apt/sources.list.d/github-cli.list \
    && apt-get update && apt-get install -y --no-install-recommends gh \
    && rm -rf /var/lib/apt/lists/*


# Azure CLI is NOT installed here. It is used by a human to try commands while
# developing workflows, so install it on the WSL host instead. Inside this container
# its login tokens (~/.azure) would be readable by the agent.
# 
# You can install Azure CLI on your WSL host using the following command:
# $ curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash


# Install Playwright's Chromium and its OS-level dependencies for E2E tests.
# - Installed as root at build time, so no sudo is needed for '--with-deps'.
# - Browsers go to a fixed shared path instead of ~/.cache, because CI and cloud agent
#   run this image with the runner's UID and HOME=/tmp (see scripts/dev).
# - PLAYWRIGHT_VERSION must match the @playwright/test version in package-lock.json.
#   A mismatch fails E2E in CI with "Executable doesn't exist", so it cannot go unnoticed.
#   Update this value in the same PR that updates @playwright/test.
#   You can get the version from package-lock.json by following command:
#   $ jq -r '.packages["node_modules/playwright-core"].version' package-lock.json
ARG PLAYWRIGHT_VERSION=1.63.0
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN npx -y playwright@${PLAYWRIGHT_VERSION} install --with-deps chromium \
    && chmod -R a+rX /ms-playwright \
    && rm -rf /root/.npm /var/lib/apt/lists/*


# Firewall script. It is copied into a root-owned path so the agent cannot edit it,
# and user 'node' may run only this script via sudo (no general sudo rights: with
# general sudo the agent could rewrite the firewall rules or anything else as root).
# Run it from devcontainer.json as: sudo /usr/local/bin/init-firewall.sh
COPY scripts/init-firewall.sh /usr/local/bin/init-firewall.sh
RUN chmod 0755 /usr/local/bin/init-firewall.sh \
    && echo "${USERNAME} ALL=(root) NOPASSWD: /usr/local/bin/init-firewall.sh" > "/etc/sudoers.d/${USERNAME}-firewall" \
    && chmod 0440 "/etc/sudoers.d/${USERNAME}-firewall"


# Mount points for the named volumes in devcontainer.json (Copilot CLI and gh config).
# They must exist with ${USERNAME} ownership in the image; otherwise Docker creates
# the volumes owned by root and ${USERNAME} cannot write to them.
RUN mkdir -p /home/${USERNAME}/.copilot /home/${USERNAME}/.config/gh \
    && chown -R ${USERNAME}:${USERNAME} /home/${USERNAME}/.copilot /home/${USERNAME}/.config

# Shows that it is inside the development image (scripts/dev checks this and runs the command directly)
ENV IN_DEV_IMAGE=1

# Working directory in the container. This is where your application code will be located.
# '/app' is a common convention, but you can choose any directory name you prefer.
WORKDIR /app
RUN chown ${USERNAME}:${USERNAME} /app


# DON'T copy the source code or install npm packages into the image.
# 'npm ci' runs at container start (Dev Container: postStartCommand,
# CI / cloud agent: scripts/dev npm ci), so dependency updates need no image rebuild.
# COPY . .


USER ${USERNAME}


# Mark that the container listen on following ports.
# DON'T FORGET to specify -p options when running the container to map these ports to your host machine.
# 4200: Angular development server port.
# 4000: Angular development server port for SSR (Server-Side Rendering).
EXPOSE 4200 4000


# Default command to keep the container running indefinitely.
CMD ["sleep", "infinity"]

