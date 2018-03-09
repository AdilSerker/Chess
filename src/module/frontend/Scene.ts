import * as three from 'three';
import { Scene, Projector, PerspectiveCamera, Raycaster, Light, WebGLRenderer, CameraHelper, CubeCamera, Object3D, SpotLight, Vector3, Ray, Vector2, SpotLightShadow, AmbientLight } from 'three';
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

    protected cube: three.Mesh;
    protected initialized: boolean = false;

    public async init(): Promise<void> {
        this.initScene();
        await this.initChess();
        this.initCamera();
        this.initControl();
        this.initLight();
        this.setRender();

        this.initialized = true;
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

    public async onDocumentMouseDown(event: MouseEvent) {
        event.preventDefault();
        this.mouse = new Vector2(
            ( event.clientX / window.innerWidth ) * 2 - 1,
          - ( event.clientY / window.innerHeight ) * 2 + 1 );

        await this.raycast();
    }

    private async raycast() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects: three.Intersection[] = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects[0] && intersects[0].object && intersects[0].object.parent.name !== '') {

            const pieceId = +intersects[0].object.parent.name;
            await this.chess.choisePiece(pieceId);

        } else if (intersects[0]) {

            const cellId = +intersects[0].object.name;
            console.log(this.chess.legalMove);
            if (this.chess.legalMove && this.chess.legalMove.length) {
                await this.chess.move(cellId);
            } else {
                await this.chess.choiceCell(cellId);
            }

        }
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
        if (this.initialized) {
            this.controls.update();
            this.cubeCamera.update(this.renderer, this.scene);
            this.renderer.render(this.scene, this.camera);
        }
    }

    private setRender(): void {
        const container = document.createElement( 'div' );
        document.body.appendChild(container);
        const renderer = new three.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = three.PCFSoftShadowMap;

        container.appendChild(renderer.domElement);
        this.renderer = renderer;
    }

    private initLight() {
        const light = new three.SpotLight( 0xffffff, 1, 0, Math.PI / 2  );
        light.position.set( 0, 1000, 0 );
        light.target.position.set( 0, 0, 0 );
        light.castShadow = false;

        light.shadow = new three.LightShadow(
            new three.PerspectiveCamera( 90, 1, 300, 1500 )
        ) as SpotLightShadow;

        light.shadow.bias = 0.0001;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        const light2 = new three.SpotLight( 0xf0f0f0, 0.5, 0, Math.PI / 2  );
        light2.position.set( -3000, 5000, -3000 );
        light2.target.position.set( 0, 0, 0 );

        this.scene.add( light, light2 );
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