import * as io from 'socket.io-client';


import { ChessScene } from './Scene';
import { Chess } from './Chess';
import { array } from './Board/types';
import { ipAddress } from '../../config/server';

export const socket = io();

const ip = ipAddress.home;

const scene = new ChessScene();

let id = Number(window.location.pathname.split('/')[2]);
let name = `player${Math.random().toString().slice(2, 8)}`;

window.addEventListener( 'resize', scene.resizeWindow.bind(scene), false );
document.addEventListener( 'click', scene.onDocumentMouseDown.bind(scene), false );
document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (keyName === 'r') {
        scene.resetCamera();
    }
});

scene.init().then(() => {
    socket.emit('loaded', id);
});


socket.on('update', (data: any) => {
    const { pieces, queue } = data;
    scene.onUpdate(pieces);
    scene.chess.queue = queue;
});


socket.on('player', (color: boolean) => {
    scene.chess.playerColor = color;
    console.log(scene.chess.playerColor);
});

socket.on('tooMany', (data: any) => {
    if(data.boolean) {

        console.log('fail');
    }
});

socket.on('legal move', (data: any) => {
    scene.chess.legalMove = data.legalMove;
});

scene.renderLoop();