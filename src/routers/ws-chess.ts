import * as Socket from 'socket.io';
import * as _ from 'lodash';

import { server } from '../server';
import { Chess } from '../module/chess/Chess';
import { Coordinates, KeyIndex, CharIndex } from '../module/chess/types/Coordinates';
import { Connect, ChessRoom, ChessGames, PieceResponse } from '../types/ws';
import { Piece } from '../module/chess/ChessPiece/Piece';


const chessRoom: ChessRoom = {};
chessRoom[0] = [];
const chess: ChessGames = {};

const io = Socket(server);

io.on('connection', (socket: SocketIO.Socket) => {
    const sid = getSid(socket);
    const connect: Connect = {};
    let roomId: number;

    connect[sid] = socket;

    // socket.on('console', (data: any) => {
    //     console.log(data);
    // })

    socket.on('loaded', (id: number) => {
        if (id !== null) {
            roomId = id;
            if (!chessRoom[id] || chessRoom[id].length == 0) {
                chessRoom[id] = [];

                chessRoom[id].push(connect);

                socket.emit('player', true);
                socket.emit('notify', 'click the URL to copy');

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
                chessRoom[id].forEach((player: Connect) => {
                    for (const sid in player) {
                        player[sid].emit('initial_pieces', { pieces, queue });
                    }
                });
                if (chess[roomId].isChangePawn) {
                    const queue = chess[roomId].getQueue() ? 0 : 1;
                    const key = getKey(chessRoom[roomId][queue]);
                    chessRoom[roomId][queue][key].emit('is_change_pawn', true);
                }

            } else if (authChess(id, sid)) {
                const player = _.find(chessRoom[id], (player) => {
                    return getKey(player) === sid;
                });
                player[sid] = socket;

                const queue: boolean = chess[id].getQueue();

                const pieces = chess[id].pieces();
                player[sid].emit('initial_pieces', { pieces, queue });

                const index = _.findIndex(chessRoom[id], (player) => {
                    return getKey(player) === sid;
                }) == 0;
                player[sid].emit('player', index);
                if (chess[roomId].isChangePawn) {
                    const queue = chess[roomId].getQueue() ? 0 : 1;
                    const key = getKey(chessRoom[roomId][queue]);
                    chessRoom[roomId][queue][key].emit('is_change_pawn', true);
                }
            }
        } else {
            chessRoom[0].push(connect);
        }

    });


    socket.on('choice piece', (id: number) => {
        if (chess[roomId]) {
            try {
                chess[roomId].choicePiece(id);

                socket.emit('legal move', { legalMove: chess[roomId].getLegalMove() });
            } catch (error) {
                const queue = chess[roomId].getQueue() ? 0 : 1;
                const key = getKey(chessRoom[roomId][queue]);
                chessRoom[roomId][queue][key].emit('notify', error.message.toUpperCase());
            }
        }
    });

    socket.on('choice cell', (data: Coordinates) => {
        try {
            chess[roomId].choiceCell({ ...data });

            socket.emit('legal move', { legalMove: chess[roomId].getLegalMove() });
        } catch (error) {
            const queue = chess[roomId].getQueue() ? 0 : 1;
            const key = getKey(chessRoom[roomId][queue]);
            chessRoom[roomId][queue][key].emit('notify', error.message.toUpperCase());
        }

    });

    socket.on('move', (data: Coordinates) => {
        try {
            chess[roomId].move({ ...data });
            const pieces = chess[roomId].pieces();
            const queue: boolean = chess[roomId].getQueue();
            chessRoom[roomId].forEach((element: Connect) => {
                for (const key in element) {
                    element[key].emit('update', { pieces, queue });
                }
            });
            if (chess[roomId].isChangePawn) {
                const queue = chess[roomId].getQueue() ? 0 : 1;
                const key = getKey(chessRoom[roomId][queue]);
                chessRoom[roomId][queue][key].emit('is_change_pawn', true);
            }
        } catch (error) {
            const queue = chess[roomId].getQueue() ? 0 : 1;
            const key = getKey(chessRoom[roomId][queue]);
            chessRoom[roomId][queue][key].emit('notify', error.message.toUpperCase());
        }
    });

    socket.on('change_pawn', (data: any) => {
        chess[roomId].changePawn(data);
        const pieces = chess[roomId].pieces();
        const queue: boolean = chess[roomId].getQueue();
        chessRoom[roomId].forEach((element: Connect) => {
            for (const key in element) {
                element[key].emit('static_update', { pieces, queue });
            }
        });
    });

    socket.on('lose', () => {
        if (chessRoom[roomId]) {

            chessRoom[roomId] = chessRoom[roomId].filter((connect: Connect) => {
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
    return chessRoom[id].filter((element: Connect) => {
        return getKey(element) === sid;
    }).length > 0;
}

function getKey(connect: Connect): string {
    return Object.keys(connect)[0];
}

function getSid(socket: SocketIO.Socket): string {
    const io = socket.request.headers.cookie.split(' ');
    return io.map((key: string) => {
        return key.split('=');
    }).filter((item: string[]) => {
        return item[0] === 'connect.sid';
    })[0][1];
}