import * as three from 'three';
import { Scene, Projector, PerspectiveCamera, Raycaster, Light, WebGLRenderer, CameraHelper, CubeCamera, Object3D, SpotLight, Vector3, Ray, Vector2, SpotLightShadow, AmbientLight } from 'three';
import { Chess } from './Chess';
import { socket } from './main';
import { PieceResponse } from '../../types/ws';

require('./lib/ShadowMapViewer');
require('./lib/Projector');

const OrbitControls = require('./lib/OrbitControls');
const TrackballControls = require('./lib/TrackballControl');

const faster = false;

export class ChessScene {
    public chess: Chess;

    private scene: Scene;
    private clock: three.Clock;
    private camera: PerspectiveCamera;
    private cubeCamera: CubeCamera;
    private light: any;
    private lightVec: Vector2 = new Vector2();

    private oldLightPos: Vector2 = new Vector2();
    private newLightPos: Vector2 = new Vector2();

    private lightShadowMap: Light;
    private renderer: WebGLRenderer;
    private controls: any;
    private raycaster: Raycaster;
    private projector: Projector;
    private mouse: Vector2;

    private f: number = 0;
    private s: number = Math.PI / 180;

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
    
    public onUpdate(pieces: PieceResponse[]) {
        this.chess.updateState(pieces);
    }

    public onStaticUpdate(pieces: PieceResponse[]) {
        this.chess.staticUpdateState(pieces);
    }
    
    private render() {
        const dt = this.clock.getDelta();
        if (this.initialized) {
            this.controls.update();
            this.cubeCamera.update(this.renderer, this.scene);
            this.update(dt);
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    private updatePositionLight(intersects: three.Intersection[]) {
        const vec = intersects[0].object.position.x === 0 ?
            intersects[0].object.parent.position :
            intersects[0].object.position;
        const newPos = this.get2Vector(vec);
        this.newLightPos = newPos;

        const currentPos = this.get2Vector(this.light.position);
        this.oldLightPos = currentPos;

        const normalVector = new three.Vector2().subVectors(newPos, currentPos);

        this.lightVec = normalVector;
    }

    private get2Vector(vector: three.Vector3): three.Vector2 {
        const { x, z } = vector;
        return new three.Vector2(x, z);
    }

    private update(dt: number) {
        
        this.light.position.x += this.lightVec.x * dt;
        this.light.position.z += this.lightVec.y * dt;

        const currentPos = this.get2Vector(this.light.position);
        const subVec = new Vector2().subVectors(currentPos, this.oldLightPos);
        if (subVec.length() > this.lightVec.length()) {
            
            this.light.position.x = this.newLightPos.x;
            this.light.position.z = this.newLightPos.y;
            this.lightVec = new Vector2();
        }

        this.chess.update(dt);
    }

    private async raycast() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects: three.Intersection[] = this.raycaster.intersectObjects(this.scene.children, true);
        if(intersects.length) {
            this.updatePositionLight(intersects);
        } else {
            this.light.position.setX(0);
            this.light.position.setZ(0);
        }
        if (intersects[0] && this.chess.playerColor === this.chess.queue) {
            
            if (this.chess.changePawn) {
                socket.emit('change_pawn', intersects[0].object.parent.name);
                this.chess.changePawn = false;
                this.chess.clearShiftPawn();
                
            } else {
                if (intersects[0].object.parent.type === 'Piece') {

                    const pieceId = Number(intersects[0].object.parent.name);
                    
                    await this.chess.choisePiece(pieceId);
        
                } else if (intersects[0].object.type === 'Cell') {
        
                    const cellId = +intersects[0].object.name;
    
                    if (this.chess.legalMove && this.chess.legalMove.length) {
                        await this.chess.move(cellId);
                    } else {
                        await this.chess.choiceCell(cellId);
                    }
                }
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

    private setRender(): void {
        const container = document.createElement( 'div' );
        document.body.appendChild(container);
        this.renderer = new three.WebGLRenderer({ antialias: faster });
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;

        this.renderer.shadowMap.type = three.PCFSoftShadowMap;

        container.appendChild(this.renderer.domElement);
    }

    private initLight() {
        const light = new three.DirectionalLight( 0xffffff, 0.6);
        light.position.set(0, 2000, 0);

        this.light = new three.SpotLight( 0xAAAAAA, 0.9, 0, Math.PI / 2  );
        this.light.position.set( 0, 1300, 0 );
        
        this.light.castShadow = faster;

        const camera = new three.PerspectiveCamera( 100, 1, 300, 2500 );
        // const helper = new three.CameraHelper(camera);
        this.light.shadow = new three.LightShadow(camera) as SpotLightShadow;

        this.light.shadow.bias = 0.0001;
        this.light.shadow.darkness = 0.2;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;

        this.scene.add( this.light, light,
            //  helper 
        );
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
        this.clock = new three.Clock();
        this.scene = scene;
    }
}