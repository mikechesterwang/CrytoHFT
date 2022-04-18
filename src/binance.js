const WebSocket = require("ws");
const url = require('url');
const HttpsProxyAgent = require('https-proxy-agent');
const { Console } = require("console");

const endpoint = "wss://stream.binance.com:9443/ws";
const logger = new Console(process.stdout, process.stderr);

var socket;
var reconnectOnClose = true;

const initConnect = (callbacks) => {

  if (process.env.https_proxy) {
    var agent = new HttpsProxyAgent(url.parse(process.env.https_proxy));
    socket = new WebSocket(endpoint, { agent });
  } else {
    socket = new WebSocket(endpoint);
  }

  Object.keys(callbacks || {}).forEach(event => {
    socket.on(event, callbacks[event]);
  })

  socket.on('open', function () {
    logger.log("ws connection opened.");
  });

  socket.on('error', (err) => {
    logger.error(err);
  })

  socket.on('close', (closeEventCode, reason) => {
    logger.debug(`ws connection closed: ${closeEventCode}: ${reason}`);
    if (reconnectOnClose) {
      logger.debug("Reconnecting...")
      setTimeout(() => {
        initConnect();
      }, 1000);
    }

  })

  socket.on('ping', () => {
    socket.pong();
  })

};

var cnt = 0;

const subscribe = (streams) => {
  socket.send(JSON.stringify({
    method: "SUBSCRIBE",
    params: streams,
    id: ++cnt
  }))
  return cnt;
}

const unsubscribe = (streams) => {
  socket.send(JSON.stringify({
    method: "UNSUBSCRIBE",
    params: streams,
    id: ++cnt
  }))
  return cnt;
}

const close = () => {
  reconnectOnClose = false;
  socket.close();
}

module.exports = {
  stream: {
    initConnect,
    subscribe,
    unsubscribe,
    close
  }
}
