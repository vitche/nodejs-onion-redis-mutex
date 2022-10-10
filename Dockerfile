FROM alpine

RUN apk add --update nodejs npm git
WORKDIR /application

COPY package.json ./
RUN npm install

# TODO: Remove this later
COPY .env ./

COPY main.js ./
COPY start.js ./

CMD ["npm", "start"]
