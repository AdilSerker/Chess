import * as three from 'three';
import { Scene, Projector, PerspectiveCamera, Raycaster, Light, WebGLRenderer, CameraHelper, CubeCamera, Object3D, SpotLight, Vector3, Ray, Vector2 } from 'three';
const OrbitControls = require('./lib/OrbitControls');
const TrackballControls = require('./lib/TrackballControl');
require('./lib/ShadowMapViewer');
require('./lib/Projector');
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
    private raycaster: Raycaster;
    private projector: Projector;
    private mouse: Vector2;


    public async init(): Promise<void> {
        this.initScene();
        await this.initChess();
        this.initCamera();
        this.initControl();
        this.initLight();
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

    public onDocumentMouseMove(event: MouseEvent) {
        event.preventDefault();
        this.mouse = new Vector2(
            ( event.clientX / window.innerWidth ) * 2 - 1,
          - ( event.clientY / window.innerHeight ) * 2 + 1 );

        const intersects: three.Intersection[] = this.raycaster.intersectObject(this.scene.children[0], true);

        console.log(intersects);


    }


    private initControl() {
        this.projector = new Projector();
        this.raycaster = new Raycaster();

    }


    private async initChess() {
        this.chess = new Chess();
        const chessState = await this.chess.initState();
        this.scene.add(chessState);
    }

    private render() {
        try {
            this.controls.update();
            // this.chess.update();
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

    private initLight() {
        const light = new SpotLight( 0xffffff, 1.5 );
        light.position.set( 0, 1500, 200 );
        light.castShadow = true;
        light.shadow = new three.SpotLightShadow( new PerspectiveCamera( 45, 1, 20, 3000) );
        light.shadow.bias = -0.000222;
        light.shadow.mapSize.width = 3000;
        light.shadow.mapSize.height = 3000;
        this.scene.add( light );

        this.light = light;
    }

    private initCamera() {
        this.camera = new three.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000 );
        this.cubeCamera = new three.CubeCamera(1, 500, 128);
        this.controls = new three.TrackballControls(this.camera);

        this.resetCamera();
    }

    public resetCamera() {
        this.camera.position.set( -366, 3895, 18 );
        this.updateCamera();
    }

    private updateCamera() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.lookAt(new three.Vector3());
        this.camera.updateProjectionMatrix();
    }

    private initScene() {
        const scene = new three.Scene();
        scene.background = new three.Color(0x000000);

        this.scene = scene;
    }
}