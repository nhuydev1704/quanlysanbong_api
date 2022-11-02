FROM node:14-alpine as builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build
EXPOSE 3001
CMD ["yarn", "start"]
