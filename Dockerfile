# Set base node image to lts-alpine
FROM node:lts-alpine

ENV YARN_CHECKSUM_BEHAVIOR ignore

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /opt/justbot

# Copy files
COPY . .

# Install client dependencies and build files
RUN yarn install --immutable \
    && yarn build

# Run client
CMD yarn start