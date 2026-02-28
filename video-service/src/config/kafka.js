const { Kafka, logLevel } = require("kafkajs");

const kafka = new Kafka({
  clientId: "video-service",
  brokers: ["localhost:9092"],
  logLevel: logLevel.ERROR,
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer Connected");
};

module.exports = { producer, connectProducer };