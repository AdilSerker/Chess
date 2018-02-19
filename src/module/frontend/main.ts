import { ChessScene } from './Scene';
import { Chess } from './Chess';
import { array } from './Board/types';
const scene = new ChessScene();

scene.init();

scene.renderLoop();

window.addEventListener( 'resize', scene.resizeWindow.bind(scene), false );
document.addEventListener( 'mousemove', scene.onDocumentMouseMove.bind(scene), false );

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (keyName === 'r') {
        scene.resetCamera();
    }
  });