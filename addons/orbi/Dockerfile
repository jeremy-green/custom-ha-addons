FROM node:latest

WORKDIR /home/node/app

COPY . .

RUN npm install --no-fund && npm audit fix --no-fund

RUN chmod a+x ./run.sh

CMD ["./run.sh"]
