FROM node:20

WORKDIR /app

# Install build tools for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./

RUN npm i

# Copy the rest of the source
COPY . .

# Expose the port
EXPOSE 8888

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
