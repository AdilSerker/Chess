import { ChessScene } from './Scene';
import { Chess } from './Chess';
import { array } from './Board/types';
import { ipAddress } from '../../config/server';
import * as io from 'socket.io-client';

const ip = ipAddress.home;
const socketIo = io();

export const socket = new WebSocket(`ws://${ip}`);
const scene = new ChessScene();

scene.init();

scene.renderLoop();

window.addEventListener( 'resize', scene.resizeWindow.bind(scene), false );
document.addEventListener( 'click', scene.onDocumentMouseDown.bind(scene), false );
socket.onmessage = function(event) {
    const pieces = event.data;
    scene.onUpdate(JSON.parse(pieces));
}


document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (keyName === 'r') {
        scene.resetCamera();
    }
});