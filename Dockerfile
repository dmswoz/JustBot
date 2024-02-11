# Set base node image to lts-alpine
FROM node:lts-slim

ENV YARN_CHECKSUM_BEHAVIOR ignore

# Install dependencies
RUN apt update && apt install -y --no-install-recommends \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /opt/justbot

# Dependencies Check
COPY package.json yarn.lock ./

# Install client dependencies
RUN yarn install --immutable

# Copy files
COPY . .

# Build files
RUN yarn build

# Run client
CMD yarn start