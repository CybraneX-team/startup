FROM node:18-slim AS base

# Install system tools for native builds (sharp, etc.)
RUN apt-get update && apt-get install -y \
    python3 make g++ gcc libc6-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Enable Corepack to use the version in package.json
RUN corepack enable

# 2. Copy Yarn 4 configuration (Wildcards prevent "not found" errors)
COPY package.json yarn.lock* .yarnrc.yml* ./
# Only copy the .yarn folder if it exists locally
COPY .yarn* ./.yarn 

# 3. Install dependencies
# We allow Yarn to fix any lockfile mismatches inside the container
RUN yarn install

# 4. Copy source code
COPY . .

# --- Build Args ---
ARG NEXT_PUBLIC_API_URL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG RAZORPAY_KEY_ID
ARG RAZORPAY_KEY_SECRET
ARG LOGOUT_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
    GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET \
    NEXTAUTH_URL=$NEXTAUTH_URL \
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID \
    RAZORPAY_KEY_SECRET=$RAZORPAY_KEY_SECRET \
    LOGOUT_URL=$LOGOUT_URL \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# 5. Build
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]