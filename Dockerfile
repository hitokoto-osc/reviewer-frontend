FROM node:14-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY . .
RUN yarn && yarn build
COPY . .
EXPOSE 3000
CMD yarn start
