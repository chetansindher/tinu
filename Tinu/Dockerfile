FROM node:6.9.4
COPY package.json /src/package.json
RUN cd /src; npm install --production
COPY . /src
EXPOSE 3000
CMD node /src/bin/www
