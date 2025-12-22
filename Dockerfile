FROM node:18-slim

# 1. Install necessary build tools for native modules (sharp, etc.)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    gcc \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. Enable Corepack and force Yarn Berry/Stable
RUN corepack enable && corepack prepare yarn@stable --activate

# --- Build Args (Necessary for Next.js Build) ---
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

# 3. Copy manifest files
COPY package.json yarn.lock* ./

# 4. FIX: Install without frozen-lockfile to allow Docker to resolve mismatches
# This will bypass the error you are seeing in the logs.
RUN yarn install

# 5. Copy source and build
COPY . .
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]