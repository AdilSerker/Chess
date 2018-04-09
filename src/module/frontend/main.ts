import * as io from 'socket.io-client';

import { ChessScene } from './Scene';
import { Chess } from './Chess';
import { array } from './Board/types';
import { ipAddress } from '../../config/server';
import { PieceResponse } from 'ws';
import { setTimeout } from 'timers';

export const socket = io();
export let id = Number(window.location.pathname.split('/')[2]);
const name = `player${Math.random().toString().slice(2, 8)}`;

let click = false;
export let MENU: boolean;
MENU = id ? false : true;

const scene = new ChessScene();


const urlElement = document.createElement('span');
urlElement.id = 'url';
const url = `${window.location.host}${window.location.pathname}`;
urlElement.innerText = id ? url : '';

const urlDiv = document.createElement('div');
urlDiv.id = 'urlBox';
urlDiv.appendChild(urlElement);
document.body.appendChild(urlDiv);

urlElement.addEventListener('transitionend', () => {
    urlDiv.innerHTML = '';
});

window.addEventListener('resize', scene.resizeWindow.bind(scene), false);
document.addEventListener('mousedown', () => {
    click = true;
});

document.addEventListener('mouseup', (event) => {
    if (click)
        scene.onDocumentMouseDown(event);
});

document.addEventListener('mousemove', (event) => {
    click = false;
});

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

socket.on('notify', (data: string) => {
    scene.notify(data);
});

socket.on('static_update', (data: any) => {
    const { pieces, queue } = data;
    scene.onStaticUpdate(pieces);
    scene.chess.queue = queue;

});

socket.on('initial_pieces', (data: any) => {
    const { pieces, queue } = data;
    scene.chess.queue = queue;
    scene.chess.initPieces(pieces);
    scene.tumblerLight = true;

    if (scene.chess.changePawn) {
        scene.chess.initShiftPawn();
    }

    urlElement.style.opacity = '0';
});

socket.on('is_change_pawn', (data: any) => {
    scene.chess.changePawn = data;
    scene.chess.initShiftPawn();
});


socket.on('player', (color: boolean) => {
    scene.chess.playerColor = color;
    scene.initVision();
    scene.resetCamera();
});

socket.on('tooMany', (data: any) => {
    if (data.boolean) {
        console.log('fail');
    }
});

socket.on('legal move', (data: any) => {
    scene.chess.legalMove = data.legalMove;
});

scene.renderLoop();