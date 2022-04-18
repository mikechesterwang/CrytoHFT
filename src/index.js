require("dotenv").config();

const { stream } = require("./binance");
const mq = require("./mq");


async function main() {
  await mq.initMq();
  stream.initConnect({
    open: () => stream.subscribe(["btcusdt@aggTrade"]),
    message: (data) => {console.log(data); mq.pushAggTrade(data) },
  });

  process.on("SIGTERM", () => {
    stream.close();
  })

}

main();
