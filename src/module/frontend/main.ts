import { ChessScene } from './Scene';
import { Chess } from './Chess';
import { array } from './Board/types';
const scene = new ChessScene();

async function initScene(): Promise<void> {
    await scene.init();
}
initScene();

scene.renderLoop();


window.addEventListener( 'resize', scene.resizeWindow.bind(scene), false );