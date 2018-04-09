import * as three from 'three';
import { Scene, Projector, PerspectiveCamera, Raycaster, Light, WebGLRenderer, CameraHelper, CubeCamera, Object3D, SpotLight, Vector3, Ray, Vector2, SpotLightShadow, AmbientLight, Path } from 'three';
import { Chess } from './Chess';
import { socket } from './main';
import { PieceResponse } from '../../types/ws';
import { MENU } from './main';

require('./lib/Projector');

const TrackballControls = require('./lib/TrackballControl');


const CAST_SHADOW = false;
const ANTIALIAS = true;

export class ChessScene {
    public chess: Chess;
    public tumblerLight: boolean = false;

    private scene: Scene;
    private clock: three.Clock;
    private camera: PerspectiveCamera;
    private cameraMinLim: three.Vector3;


    private light: three.SpotLight;
    private directionLight: three.DirectionalLight;
    private lightVec: Vector2 = new Vector2();

    private oldLightPos: Vector2 = new Vector2();
    private newLightPos: Vector2 = new Vector2();

    private lightShadowMap: Light;
    private renderer: WebGLRenderer;
    private controls: three.TrackballControls;
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
        this.setRender();
    }

    public initVision() {
        this.initCamera();
        this.initLight();
        this.initControl();
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
        // event.preventDefault();
        this.mouse = new Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            - (event.clientY / window.innerHeight) * 2 + 1);
        this.interface(event);
        if (!MENU) {
            await this.raycast();

        }
    }

    private interface(event: any) {
        /* tslint:disable */
        if (event.path[0].offsetParent.id === 'urlBox') {
            const url = event.path[0]
            let range = document.createRange();
            range.selectNode(url);
            window.getSelection().addRange(range);

            try {
                document.execCommand('copy');
                this.notify('copy to clipboard');
            } catch (err) {
                console.log('Can`t copy, boss');
            }

            window.getSelection().removeAllRanges();

        }
        if (event.path[0].offsetParent.id === 'shift') {
            socket.emit('change_pawn', event.path[0].id);
            this.chess.clearShiftPawn();
            this.chess.changePawn = false;
        }

        /* tslint:enable */
    }

    public notify(text: string) {
        let notify = document.getElementById('notify');
        if (!notify) {
            notify = document.createElement('div');
            notify.id = 'notify';
        }
        const message: HTMLSpanElement = document.createElement('span');
        message.id = 'message';
        notify.innerHTML = '';
        message.innerText = text;
        notify.appendChild(message);
        document.body.appendChild(notify);

        setTimeout(() => {
            message.style.opacity = '0';
        }, 3000);

        message.addEventListener('transitionend', () => {
            notify.innerHTML = '';
        });
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
            this.update(dt);
            this.controls.update();
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

        const vector = new three.Vector2().subVectors(newPos, currentPos);
        const normalVector = new three.Vector2()
            .subVectors(newPos, currentPos)
            .clone()
            .normalize();
        this.lightVec = normalVector.multiplyScalar(vector.length());
    }

    private get2Vector(vector: three.Vector3): three.Vector2 {
        const { x, z } = vector;
        return new three.Vector2(x, z);
    }

    private update(dt: number) {
        this.light.position.x += this.lightVec.x * 2 * dt;
        this.light.position.z += this.lightVec.y * 2 * dt;

        const currentPos = this.get2Vector(this.light.position);
        const subVec = new Vector2().subVectors(currentPos, this.oldLightPos);
        if (subVec.length() > this.lightVec.length()) {

            this.light.position.x = this.newLightPos.x;
            this.light.position.z = this.newLightPos.y;
            this.lightVec = new Vector2();
        }

        this.chess.update(dt);

        if (this.tumblerLight) {
            if (this.directionLight.intensity < 1.2) {
                this.directionLight.intensity += dt;
            }
            else if (this.light.intensity < 1) {
                this.light.intensity += dt;
            }
        }
        const { x, y, z } = this.camera.position;
        this.directionLight.position.set(x, y, z);
    }

    private async raycast() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects: three.Intersection[] = this.raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length) {
            this.updatePositionLight(intersects);
        } else {
            this.light.position.setX(0);
            this.light.position.setZ(0);
        }
        if (intersects[0] && this.chess.playerColor === this.chess.queue) {

            if (!this.chess.changePawn) {
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
        const container = document.createElement('div');
        document.body.appendChild(container);
        this.renderer = new three.WebGLRenderer({ antialias: ANTIALIAS });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        container.appendChild(this.renderer.domElement);
    }

    private initLight() {
        this.directionLight = new three.DirectionalLight(0xffffff, 0);


        this.light = new three.SpotLight(0xffffee, 0, 0, Math.PI);
        this.light.position.set(0, 100, 0);

        this.scene.add(this.light, this.directionLight);
    }

    private initCamera() {
        this.camera = new three.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000);
        this.controls = new three.TrackballControls(this.camera);
        this.controls.noRoll = true;
        this.controls.maxDistance = 6000;
        this.controls.minDistance = 2000;
        this.controls.noRoll = true;
        this.controls.noPan = true;

        if (this.chess.playerColor) {
            this.controls.position0.set(-3260, 2300, -50);
        } else {
            this.controls.position0.set(3260, 2300, -50);
        }
        this.controls.target.set(0, 0, 0);

    }

    public resetCamera() {
        this.controls.reset();

        this.updateCamera();
    }

    private updateCamera() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.lookAt(new three.Vector3());
        this.camera.updateProjectionMatrix();
    }

    private initScene() {
        this.scene = new three.Scene();
        this.scene.background = new three.Color(0x000000);

        this.clock = new three.Clock();
    }
}