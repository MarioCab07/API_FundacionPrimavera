FROM node:22-alpine3.21


# Install corepack and yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Install dependencies only when needed
WORKDIR /app

# Copy package.json and yarn.lock files to the working directory
COPY package*.json yarn.lock .env ./


# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# EXPOSING PORT
EXPOSE 8008

# Start the application
CMD [ "yarn", "dev" ]