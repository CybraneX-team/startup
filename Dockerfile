# Use Node 18 Slim as the base
FROM node:18-slim AS base

# Install system dependencies required for native modules (like sharp/canvas)
# We keep these minimal to keep the image size small
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Enable Corepack to manage Yarn versions automatically
RUN corepack enable && corepack prepare yarn@stable --activate

# --- Environment Variables / Build Args ---
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
    NEXT_TELEMETRY_DISABLED=1

# --- Build Steps ---

# 1. Copy only files needed for installing dependencies
COPY package.json yarn.lock ./

# 2. Install dependencies 
# Note: If this still fails, your local yarn.lock might be out of sync.
# You can try 'yarn install' without the --frozen-lockfile flag once to debug.
RUN yarn install --frozen-lockfile

# 3. Copy the rest of the source code
COPY . .

# 4. Build the Next.js application
RUN yarn build

# --- Execution ---
EXPOSE 3000

# Next.js uses 'next start' which is mapped to 'yarn start' in your pkg.json
CMD ["yarn", "start"]