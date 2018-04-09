import * as http from 'http';
import { app } from './app';
import { ipAddress } from './config/server';
const server = http.createServer(app);
import * as SocketIO from 'socket.io';

/**
 * Start Express server.
 */
server.listen(process.env.PORT || 8888, () => {
console.log(`  App is running at http://${ipAddress.home}`);
console.log("  Press CTRL-C to stop\n");
});

export { server };

require('./routers/ws-chess');
