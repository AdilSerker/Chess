import * as three from 'three';
import { Mesh, Scene, Object3D, Vector3, Group } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
require('../lib/OBJLoader');
import { Piece } from './Piece';
import { numberColumn, charRow, array } from '../Board/types';
import { Coordinates as Position, KeyIndex } from '../../chess/types/Coordinates';

export class Bishop extends Piece {
    static meshBishop: any = null;

    public initMesh(): Group {

        const x = array[this.coordinate_.num];
        const z = array[KeyIndex[this.coordinate_.char]];

        const material = new three.MeshStandardMaterial({
            map: null,
            bumpScale: - 0.05,
            color: this.color_ ? 0xffffff : 0x111111,
        });

        const BishopMesh = Bishop.meshBishop.clone(true);
        BishopMesh.traverse(function ( child: any ) {
            if ( child instanceof three.Mesh ) {
                child.material = material;
            }
        });
        BishopMesh.scale.set(100, 100, 100);
        BishopMesh.position.set(x * 100 - 50, 50, z * 100 - 57);
        BishopMesh.name = `${this.id}`;
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
                    // console.log( Math.round(percentComplete) + '% downloaded' );
                }
            }, (err) => { });
        });
    }

    public getPiece() {
        return this.mesh_;
    }
}