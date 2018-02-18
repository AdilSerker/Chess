import * as three from 'three';
import { Mesh, Scene, Object3D, Vector3, Group } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
require('../lib/OBJLoader');
import { Piece } from './Piece';


export class Rook extends Piece {
    static meshRook: any = null;


    public initMesh(x: number, z: number, bool: boolean): Group {
        const material = new three.MeshStandardMaterial({
            map: null,
            bumpScale: - 0.05,
            color: bool ? 0xffffff : 0x111111,
            // metalness: 0.5,
            // roughness: 1.0
        });

        const rookMesh = Rook.meshRook.clone(true);
        rookMesh.traverse(function ( child: any ) {
            if ( child instanceof three.Mesh ) {
                child.material = material;
            }
        });
        rookMesh.scale.set(100, 100, 100);
        rookMesh.position.set(x * 100 - 50, 50, z * 100 - 57);

        rookMesh.castShadow = true;
        rookMesh.receiveShadow = true;

        return this.mesh_ = rookMesh;

    }

    static async getGeometry(): Promise<{}> {
        const loader = new three.OBJLoader();
        return await new Promise((resolve) => {
            loader.load('obj/RookLight.obj', (object: Object3D) => {

                Rook.meshRook = object;

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