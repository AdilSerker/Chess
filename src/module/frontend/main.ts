import { ChessScene } from './Scene';
import { Board } from './Board/Board';

const scene = new ChessScene();
const board = new Board();

scene.init();

scene.addElements(board.getBoard());

window.onload = function() {

    scene.renderLoop();
};

window.addEventListener( 'resize', scene.resizeWindow.bind(scene), false );