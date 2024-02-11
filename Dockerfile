FROM node:lts-alpine
ENV YARN_CHECKSUM_BEHAVIOR ignore

RUN apt-get update && apt-get install -y --no-install-recommends