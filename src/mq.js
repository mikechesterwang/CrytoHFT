const path = require("path");
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'cryto-app',
  brokers: ['localhost:9092'],
})

const producer = kafka.producer();

async function initMq() {
  await producer.connect();
}

async function pushAggTrade(data) {
  await producer.send({
    topic: "AggTrade",
    messages: [
      { value: JSON.stringify({
        eventTime: data.E,
        tradeId: data.a,
        price: data.p,
        quantity: data.q,
        tradeTime: data.T,
        maker: data.m
      }) }
    ]
  });
}

async function close() {
  await producer.disconnect();
}

module.exports = {
  initMq,
  pushAggTrade,
  close
};
