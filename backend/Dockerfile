# build
FROM node:16 AS builder

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --development
COPY . .

RUN yarn build

# run
FROM node:16-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production
COPY . .
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/main"]