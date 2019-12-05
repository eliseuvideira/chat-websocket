import http from 'http';
import app from './app';
import WebSocketServer from './socket';

const port = parseInt(process.env.PORT || '3000', 10);
app.set('port', port);

const server = http.createServer(app);

const onError = (err: any) => {
  if (err.syscall !== 'listen') {
    throw err;
  }
  switch (err.code) {
    case 'EACESS':
      // tslint:disable-next-line: no-console
      console.error(`Port ${port} requires elevated privileges`);
      break;
    case 'EADDRINUSE':
      // tslint:disable-next-line: no-console
      console.error(`Port ${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
};

const onListening = () => {
  const addr: any = server.address();
  // tslint:disable-next-line: no-console
  console.log(`Listening on port ${addr.port}`);
};

const run = async () => {
  server.listen(3000);
  server.on('error', onError);
  server.on('listening', onListening);
  const webSocket = new WebSocketServer(server);
  webSocket.init();
};

run().catch((err) => {
  // tslint:disable-next-line: no-console
  console.error(err);
  process.exit(1);
});
