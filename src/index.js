let DHT = require('@hyperswarm/dht');
let crypto = require('hypercore-crypto');
let net = require('net');
let pump = require('pump');
let node = new DHT({});
let socks = require('socksv5');

module.exports = () => {
  return {
    /* share a local port remotely */
    serve: (key, port, stdio) => {
      let keyPair = crypto.keyPair(crypto.data(Buffer.from(key)));
      let server = node.createServer();
      server.on('connection', function (socket) {
        if (stdio) pump(process.stdin, socket, process.stdout);
        else {
          let local = net.connect(port, 'localhost');
          pump(socket, local, socket);
        }
      });
      server.listen(keyPair);
      return keyPair.publicKey;
    },
    /* reflect a remote port locally */
    client: (publicKey, port, stdio) => {
      if (stdio) {
        let socket = node.connect(publicKey);
        pump(process.stdin, socket, process.stdout);
      } else {
        let server = net.createServer(function (servsock) {
          let socket = node.connect(publicKey);
          pump(servsock, socket, servsock);
        });
        server.listen(port, 'localhost');
      }
      return publicKey;
    },
    socksServe: (key, port, stdio) => {
      let keyPair = crypto.keyPair(crypto.data(Buffer.from(key)));
      let server = node.createServer();

      let srv = socks.createServer(function (info, accept, deny) {
        console.log(info);
        accept();
      });

      srv.useAuth(socks.auth.None());

      srv.listen(port, 'localhost', function () {
        console.log('> socks server listening on ' + pubKey.toString('hex'));
      });

      server.on('connection', function (socket) {
        if (stdio) pump(process.stdin, socket, process.stdout);
        else {
          let local = net.connect(port, 'localhost');
          pump(socket, local, socket);
        }
      });

      process.on('uncaughtException', (err) => {});

      server.listen(keyPair);
      return keyPair.publicKey;
    },
  };
};
