FROM node:14
ENV NODE_ENV=development
WORKDIR /app
RUN npm install
RUN npm install knex -g
