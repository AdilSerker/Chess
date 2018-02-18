import * as three from 'three';
import { Mesh, Scene, Object3D, Vector3, Group } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
require('../lib/OBJLoader');
import { Piece } from './Piece';


export class Bishop extends Piece {
    static meshBishop: any = null;

    public initMesh(x: number, z: number, bool: boolean): Group {
        const material = new three.MeshStandardMaterial({
            map: null,
            bumpScale: - 0.05,
            color: bool ? 0xffffff : 0x111111,
            // metalness: 0.5,
            // roughness: 1.0
        });

        const BishopMesh = Bishop.meshBishop.clone(true);
        BishopMesh.traverse(function ( child: any ) {
            if ( child instanceof three.Mesh ) {
                child.material = material;
            }
        });
        BishopMesh.scale.set(100, 100, 100);
        BishopMesh.position.set(x * 100 - 50, 50, z * 100 - 57);
        BishopMesh.castShadow = true;
        BishopMesh.receiveShadow = true;


        return this.mesh_ = BishopMesh;

    }

    static async getGeometry(): Promise<{}> {
        const loader = new three.OBJLoader();
        return await new Promise((resolve) => {
            loader.load('obj/BishopLight.obj', (object: Object3D) => {

                Bishop.meshBishop = object;

                resolve(object);
            }, ( xhr ) => {
                if ( xhr.lengthComputable ) {
                    const percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round(percentComplete) + '% downloaded' );
                }
            }, (err) => { });
        });
    }

    public getPiece() {
        return this.mesh_;
    }
}