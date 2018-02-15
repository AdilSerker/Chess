import { ChessScene } from './Scene';
import { Board } from './Board/Board';
import { PawnModel } from './Piece/Pawn';

const scene = new ChessScene();
const board = new Board();

scene.init();
const pawn = new PawnModel();

scene.addElements(board.getBoard());

window.onload = function() {

    scene.renderLoop();
};

window.addEventListener( 'resize', scene.resizeWindow.bind(scene), false );