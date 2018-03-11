import * as http from 'http';
import { app } from './app';
import * as SocketIO from 'socket.io';

const server = http.createServer(app);
const io = SocketIO(server);

/**
 * Start Express server.
 */
server.listen(process.env.PORT || 8888, () => {
	console.log(`  App is running at http://localhost:${server.address().port}`);
	console.log("  Press CTRL-C to stop\n");
});


import * as chessController from './controllers/chess';
import { Chess } from './module/chess/Chess';
import { Coordinates, KeyIndex, CharIndex } from './module/chess/types/Coordinates';


/**
 * Start WebSocket server.
 */
import * as WebSocket from 'ws';
const wss = new WebSocket.Server({ server });

const clients: any = {};
const chessRoom: any = {};

wss.on('connection', (ws: WebSocket) => {
	const id = Number(Math.random().toString().slice(2));
	clients[id] = ws;
//   chessRoom[id] = new Chess(id);
	console.log(`NEW CONNECTION ${id}`);

	ws.on('message', function(coordinate: any) {

		chessController.move(JSON.parse(coordinate));
		const pieces = chessController.pieces();
		for (let key in clients) {
			clients[key].send(JSON.stringify(pieces));
		}
	});

	ws.on('close', function() {
		console.log('соединение закрыто ' + id);
		delete clients[id];
		// delete chessRoom[id];
	});

});


/**
 * Start WebSocket server.
 */
io.on('connection', (socket) => {
	console.log('connection up');
	socket.on('disconnect', () => {
		console.log('disconnect');
	})
})
