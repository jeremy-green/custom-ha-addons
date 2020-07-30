FROM node:latest

RUN apt-get -y update && apt-get install -y jq

WORKDIR /home/node/app

COPY . .

RUN npm install --no-fund && npm audit fix --no-fund

RUN chmod a+x ./run.sh

CMD ["./run.sh"]
