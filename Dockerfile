FROM node:18-slim

WORKDIR /app

# Install required system packages
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

# Install dependencies and force sharp rebuild
RUN yarn install --frozen-lockfile && \
    yarn add sharp && \
    npm rebuild sharp --platform=linux --arch=x64 --libc=glibc

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
