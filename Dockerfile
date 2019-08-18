FROM node:12
WORKDIR /usr/src/app
RUN apt-get -y update
RUN apt-get -y install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
RUN npm install typescript -g
RUN npm install ts-node -g
COPY package*.json ./
RUN npm install
EXPOSE 9090

#COPY . .
#RUN apt-get update && apt-get install -y build-essential && apt-get install -y python && npm install
# CMD [ "ts-node", "./src/index.ts" ]
# FROM node:latest
# RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
# WORKDIR /home/node/app
# COPY package.json /home/node/app/
# RUN npm install
# COPY --chown=node:node . .
# EXPOSE 9090
# CMD [ “ts-node”, “./src/index.ts” ]