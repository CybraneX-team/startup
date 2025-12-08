FROM node:18-slim

WORKDIR /app

# -----------------------------------
# Declare build args BEFORE everything
# -----------------------------------
ARG NEXT_PUBLIC_API_URL
ARG googleClientId
ARG googleClientScret
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG razorpay_key_secret
ARG razorpay_key_id
ARG logoutUrl

# Make them available during build
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV googleClientId=${googleClientId}
ENV googleClientScret=${googleClientScret}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV razorpay_key_secret=${razorpay_key_secret}
ENV razorpay_key_id=${razorpay_key_id}
ENV logoutUrl=${logoutUrl}

# Install dependencies for sharp + canvas
RUN apt-get update && apt-get install -y \
  build-essential \
  libcairo2-dev \
  libjpeg-dev \
  libpango1.0-dev \
  libgif-dev \
  librsvg2-dev \
  curl \
  gnupg \
  && rm -rf /var/lib/apt/lists/*

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y yarn

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile && \
    yarn add sharp && \
    npm rebuild sharp --platform=linux --arch=x64 --libc=glibc

COPY . .

# Build with env vars available
RUN rm -rf .next


RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
