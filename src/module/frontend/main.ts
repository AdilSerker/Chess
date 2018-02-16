import { ChessScene } from './Scene';
import { Chess } from './Chess';
import { array } from './Board/types';
const scene = new ChessScene();
const chess = new Chess();

async function initScene(): Promise<void> {

    scene.init();
    const chessState = await chess.initState();
    scene.addElements(
        chessState
    );
}
initScene();

scene.renderLoop();


window.addEventListener( 'resize', scene.resizeWindow.bind(scene), false );