import { ChessScene } from './Scene';

const scene = new ChessScene();

window.onload = function() {
    scene.init();
    scene.renderLoop();
};

window.addEventListener( 'resize', scene.resizeWindow.bind(scene), false );