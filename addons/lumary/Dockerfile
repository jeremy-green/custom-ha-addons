FROM node:latest

WORKDIR /home/node/app

COPY . .

RUN npm install --production && npm audit fix

RUN chmod a+x ./run.sh

CMD ["./run.sh"]
