import * as three from 'three';
import { Scene, PerspectiveCamera, Raycaster, Light, WebGLRenderer, CameraHelper, CubeCamera, Object3D, SpotLight, Vector2 } from 'three';
const OrbitControls = require('./lib/OrbitControls');
const TrackballControls = require('./lib/TrackballControl');
require('./lib/ShadowMapViewer');
import { Chess } from './Chess';


export class ChessScene {
    private chess: Chess;
    private scene: Scene;
    private camera: PerspectiveCamera;
    private cubeCamera: CubeCamera;
    private light: Light;
    private lightShadowMap: Light;
    private renderer: WebGLRenderer;
    private controls: any;


    public async init(): Promise<void> {
        this.getScene();
        await this.getChess();
        this.getCamera();
        this.getLight();
        this.setRender();
    }

    public renderLoop() {
        requestAnimationFrame(this.renderLoop.bind(this));
        this.render();
    }

    public resizeWindow(event: Event) {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls.handleResize();
        this.updateCamera();
    }

    private async getChess() {
        this.chess = new Chess();
        const chessState = await this.chess.initState();
        this.scene.add(chessState);
        console.log(this.chess);
    }

    private render() {
        try {
            this.controls.update();
            this.cubeCamera.update(this.renderer, this.scene);
            this.renderer.render(this.scene, this.camera);
        } catch (error) {

        }

    }

    private setRender(): void {
        const container = document.createElement( 'div' );
        document.body.appendChild(container);
        const renderer = new three.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = three.PCFSoftShadowMap;

        container.appendChild(renderer.domElement);
        this.renderer = renderer;
    }

    private getLight() {
        this.scene.add(new three.AmbientLight(0x000000));

        const light = new SpotLight( 0xffffff, 1.5 );
        light.position.set( 0, 1500, 200 );
        light.castShadow = true;
        light.shadow = new three.SpotLightShadow( new PerspectiveCamera( 180, 1, 20, 3000) );
        light.shadow.bias = -0.000222;
        light.shadow.mapSize.width = 2500;
        light.shadow.mapSize.height = 2500;
        this.scene.add( light );

        this.light = light;
    }

    private getCamera() {
        this.camera = new three.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000 );
        this.cubeCamera = new three.CubeCamera(1, 10000, 128);
        this.controls = new three.TrackballControls(this.camera);

        this.resetCamera();
    }

    private resetCamera() {
        this.camera.position.set( -366, 3895, 18 );
        this.updateCamera();
    }

    private updateCamera() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.lookAt(new three.Vector3());
        this.camera.updateProjectionMatrix();
    }

    private getScene() {
        const scene = new three.Scene();
        scene.background = new three.Color(0x000000);

        this.scene = scene;
    }
}