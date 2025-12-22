FROM node:18-slim AS base

# Install system tools for native builds (sharp, etc.)
RUN apt-get update && apt-get install -y \
    python3 make g++ gcc libc6-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. MUST enable corepack so Docker uses Yarn 4.12.0 from package.json
RUN corepack enable

# 2. Copy Yarn 4 specific config files (CRITICAL)
COPY package.json yarn.lock* .yarnrc.yml* ./
COPY .yarn ./.yarn 

# 3. Install dependencies
# We remove --frozen-lockfile to allow the container to finalize the lockfile
RUN yarn install

# 4. Copy source code
COPY . .

# --- Build Args (Must be here for Next.js build) ---
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

# 5. Build the app
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]