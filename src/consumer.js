const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'cryto-app',
  brokers: ['localhost:9092'],
})

async function init(){
    const consumer = kafka.consumer();
    await consumer.connect();
}