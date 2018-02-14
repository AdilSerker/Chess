import * as three from 'three';
import { Scene, PerspectiveCamera, Light, WebGLRenderer, CubeCamera, Object3D } from 'three';
const OrbitControls = require('./lib/OrbitControls');
const TrackballControls = require('./lib/TrackballControl');

export class ChessScene {
    private scene_: Scene;
    private camera_: PerspectiveCamera;
    private cubeCamera_: CubeCamera;
    private light_: Light;
    private renderer_: WebGLRenderer;
    private controls_: any;

    public init(): void {

        const container = document.createElement( 'div' );
        document.body.appendChild(container);

        this._getScene();
        this._getCamera();
        this._getLight();
        this._setRender(container);
    }

    public renderLoop() {
        requestAnimationFrame(this.renderLoop.bind(this));
        this._controlUpdate();
        this._render();
    }

    public resizeWindow(event: Event) {
        this.camera_.aspect = window.innerWidth / window.innerHeight;
        this.camera_.updateProjectionMatrix();
        this.renderer_.setSize(window.innerWidth, window.innerHeight);
        this.controls_.handleResize();
    }

    public addElements(...object: Object3D[]): void {
        this.scene_.add(...object);
    }

    private _render() {
        this.cubeCamera_.update(this.renderer_, this.scene_);
        this.renderer_.render(this.scene_, this.camera_);
    }

    private _setRender(container: HTMLElement): void {
        const renderer = new three.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        this.renderer_ = renderer;
    }

    private _getLight() {
        this.scene_.add(new three.AmbientLight(0xf0f0f0));
        const light = new three.SpotLight(0xffffff, 1.5);
        light.position.set( 0, 1500, 200 );
        light.castShadow = true;
        light.shadow = new three.SpotLightShadow( new three.PerspectiveCamera( 70, 1, 200, 2000 ) );
        light.shadow.bias = -0.000222;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        this.scene_.add(light);
        this.light_ = light;
    }

    private _controlUpdate() {
        this.controls_.update();
    }

    private _getCamera() {
        const camera = new three.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000 );
        camera.position.set( -366, 3895, 18 );
        camera.quaternion.set(-0.5217, 0.4754, 0.5255, 0.4751);

        this.camera_ = camera;
        this.cubeCamera_ = new three.CubeCamera(1, 10000, 128);
        this.controls_ = new three.TrackballControls(camera);
        this.controls_.target.set(0, 120, 0);

        this.controls_.rotateSpeed = 1.0;
        this.controls_.zoomSpeed = 1.2;
        this.controls_.panSpeed = 0.8;
        this.controls_.noZoom = false;
        this.controls_.noPan = false;
        this.controls_.staticMoving = true;
        this.controls_.dynamicDampingFactor = 0.15;
        this.controls_.keys = [ 65, 83, 68 ];

    }

    private _getScene() {
        const scene = new three.Scene();
        scene.background = new three.Color(0xf0f0f0);
        const geometry = new three.PlaneGeometry(100000, 100000);
        const material = new three.MeshStandardMaterial( {
            map: null,
            bumpScale: - 0.05,
            color: 0xaaaaaa,
            metalness: 0.5,
            roughness: 1.0
        } );
        const plane = new three.Mesh(geometry, material);
        plane.position.set(0, -1800, 0);
        plane.rotation.x = - Math.PI * 0.5;

        plane.receiveShadow = true;
        scene.add(plane);

        const grid = new three.GridHelper(1600, 8);
        grid.material.opacity = 0.25;
        grid.material.transparent = true;
        scene.add(grid);

        this.scene_ = scene;
    }
}