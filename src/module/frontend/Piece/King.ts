import * as three from 'three';
import { Mesh, Scene, Object3D, Vector3, Group } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
require('../lib/OBJLoader');
import { Piece } from './Piece';

export class King extends Piece {
    static meshKing: any = null;

    public initMesh(x: number, z: number, bool: boolean): Group {
        const material = new three.MeshStandardMaterial({
            map: null,
            bumpScale: - 0.05,
            color: bool ? 0xffffff : 0x111111,
            // metalness: 0.5,
            // roughness: 1.0
        });

        const KingMesh = King.meshKing.clone(true);
        KingMesh.traverse(function ( child: any ) {
            if ( child instanceof three.Mesh ) {
                child.material = material;
            }
        });

        KingMesh.scale.set(100, 100, 100);

        KingMesh.rotation.y = Math.PI * 0.5;

        KingMesh.position.set(x * 100 - 60, 50, z * 100 + 50);
        KingMesh.castShadow = true;
        KingMesh.receiveShadow = true;
        return this.mesh_ = KingMesh;

    }

    static async getGeometry(): Promise<{}> {
        const loader = new three.OBJLoader();
        return await new Promise((resolve) => {
            loader.load('obj/KingLight.obj', (object: Object3D) => {

                King.meshKing = object;

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