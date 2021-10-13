#!/usr/bin/env node
let yargs = require('yargs');

function server(yargs) {
  return yargs
    .option('port', {
      describe: 'The port to run the server on (hymachi)',
      default: 4973,
    })
    .option('key', {
      describe: 'The key to run the server on (hymachi)',
      default: 'hymachi-test',
    })
    .option('stdio', {
      default: false,
    });
}

function client(yargs) {
  return yargs
    .option('port', {
      describe: 'The port to run the server on (hymachi)',
      default: 0,
    })
    .option('key', {
      describe: 'The key to run the server on (hymachi)',
      default: 'hymachi-test',
    })
    .option('stdio', {
      default: false,
    });
}

function socksServer(yargs) {
  return yargs
    .option('port', {
      describe: 'The port to run the server on (hymachi)',
      default: 0,
    })
    .option('key', {
      describe: 'The key to run the server on (hymachi)',
      default: 'hymachi-test',
    })
    .option('stdio', {
      default: false,
    });
}

async function runServer(args) {
  let { serve } = require('.')();

  let publicKey = serve(args['key'], args['port'], args['stdio']);

  console.log(`Relay running on ${publicKey.toString('hex')}`);
}

async function runClient(args) {
  let { client } = require('.')();

  let publicKey = client(
    Buffer.from(args['key'], 'hex'),
    args['port'],
    args['stdio']
  );

  console.log(
    `Tunnel listening on http://localhost:${
      args['port']
    } on key ${publicKey.toString('hex')}`
  );
}

async function runSocksServer(args) {
  let { socksServe } = require('.')();

  let publicKey = socksServe(args['key'], args['port'], args['stdio']);

  console.log('success', publicKey.toString('hex'));
}

yargs
  .scriptName('hymachi')
  .showHelpOnFail(true)
  .demandCommand()
  .command('create', 'Create the hymachi.', server, runServer)
  .command('connect', 'Connect to the hymachi.', client, runClient)
  .command('socks', 'Create the socks hymachi.', socksServer, runSocksServer)
  .help()
  .parse(process.argv.slice(2));
