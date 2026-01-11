# syntax=docker/dockerfile:1

# 最新LTSのNode.jsバージョンのイメージを https://hub.docker.com/_/node から取得。
# TrixieはDebianのコードネーム。
FROM node:24-trixie

# Install packages to Linux OS.
# COMMENT OUT:
#   Pure Angular project doesn't need additional packages.
#   All dependencies are managed by NPM.
# RUN apt-get update

# ワーキングディレクトリの設定。
# docker run コマンドの -w オプションと同じ。
WORKDIR /app

