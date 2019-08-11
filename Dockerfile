FROM node:12
WORKDIR /usr/src/app
RUN npm install typescript -g
RUN npm install ts-node -g
COPY package*.json ./
RUN npm install
# COPY . .
EXPOSE 9090
# CMD [ "ts-node", "./src/index.ts" ]

# FROM node:latest
# RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
# WORKDIR /home/node/app
# COPY package.json /home/node/app/
# RUN npm install
# COPY --chown=node:node . .
# EXPOSE 9090
# CMD [ “ts-node”, “./src/index.ts” ]