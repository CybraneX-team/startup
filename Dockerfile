FROM node:18-slim

WORKDIR /app

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

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y yarn

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile && \
    yarn add sharp && \
    npm rebuild sharp --platform=linux --arch=x64 --libc=glibc

COPY . .

# --- NEW SECTION STARTS ---
# Accept the build argument
ARG NEXT_PUBLIC_API_URL
# Set it as an environment variable for the build command
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# --- NEW SECTION ENDS ---

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]