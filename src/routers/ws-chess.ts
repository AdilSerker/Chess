import * as Socket from 'socket.io';
import * as _ from 'lodash';

import { server } from '../server';
import { Chess } from '../module/chess/Chess';
import { Coordinates, KeyIndex, CharIndex } from '../module/chess/types/Coordinates';

const clients: any = {};
const chessRoom: any = {};
const chess: any = {};

const io = Socket(server);

io.on('connection', (socket: SocketIO.Socket) => {
    const sid = getSid(socket);
    const connect: any = {};
    let roomId: number;
    
    connect[sid] = socket;
    clients[sid] = socket;

    socket.on('loaded', (id: number) => {
        roomId = id;
        if (!chessRoom[id] || chessRoom[id].length == 0) {
            chessRoom[id] = [];
            
            chessRoom[id].push(connect);

            socket.emit('player', true);

            console.log(`in room ${id} ${chessRoom[id].length} users`);

        } else if (chessRoom[id].length == 1) {
            chessRoom[id].push(connect);
            socket.emit('player', false);
            console.log(`in room ${id} ${chessRoom[id].length} users`);

            if (!chess[id]) {
                chess[id] = new Chess(id);
                chess[id].init();
            }

            const queue: boolean = chess[id].getQueue();

            const pieces = chess[id].pieces();
            chessRoom[id].forEach((element: any) => {
                for (let key in element) {
                    element[key].emit('update', { pieces, queue });
                }
            });
            
        } else if (authChess(id, sid)) {
            const player = _.find(chessRoom[id], (player) => {
                return getKey(player) === sid;
            });

            const index = _.findIndex(chessRoom[id], (player) => {
                return getKey(player) === sid;
            }) == 0;
            const queue: boolean = chess[id].getQueue();
            player[sid] = socket;

            const pieces = chess[id].pieces();
            player[sid].emit('update', { pieces, queue });
            player[sid].emit('player', index);
        }
    });


    socket.on('choice piece', (id: number) => {
        if (chess[roomId]) {
            chess[roomId].choicePiece(id);
            
            socket.emit('legal move', { legalMove: chess[roomId].getLegalMove() });
        }
    });

    socket.on('choice cell', (data: any) => {
        chess[roomId].choiceCell({
            char: data.char,
            num: data.num
        });
        
        socket.emit('legal move', { legalMove: chess[roomId].getLegalMove() });
    });
    
    socket.on('move', (data: any) => {
        
        chess[roomId].move({ ...data });

        const pieces = chess[roomId].pieces();
        const queue: boolean = chess[roomId].getQueue();
        chessRoom[roomId].forEach((element: any) => {
            for (let key in element) {
                element[key].emit('update', { pieces, queue });
            }
        });
    });

    socket.on('lose', () => {
        if (chessRoom[roomId]) {

            chessRoom[roomId] = chessRoom[roomId].filter((connect: any) => {
                
                return getKey(connect) !== sid;
            });

            console.log(`in room ${roomId} ${chessRoom[roomId].length} users`);
        }
        
    });

    socket.on('disconnect', () => {
        console.log(`user whit sid: ${sid} disconnect`);
    });
});

function authChess(id: number, sid: string): boolean {
    return chessRoom[id].filter((element: any) => {
        return getKey(element) === sid
    }).length > 0;
}

function getKey(connect: any): string {
    return Object.keys(connect)[0];
}

function getSid(socket: SocketIO.Socket): string {
    let io = socket.request.headers.cookie.split(' ');
    return io.map((key: string) => {
            return key.split('=');            
        }).filter((item: string[]) => {
            return item[0] === 'connect.sid';
        })[0][1];
}