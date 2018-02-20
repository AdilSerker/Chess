import * as three from 'three';
import { Mesh, Scene, Object3D, Vector3, Group } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
require('../lib/OBJLoader');
import { Piece } from './Piece';

import { numberColumn, charRow, array } from '../Board/types';
import { Coordinates as Position, KeyIndex } from '../../chess/types/Coordinates';

const counter = 0;
export class Queen extends Piece {
    static meshQueen: any = null;


    public initMesh(): Group {
        const x = array[this.coordinate_.num];
        const z = array[KeyIndex[this.coordinate_.char]];

        const material = new three.MeshStandardMaterial({
            map: null,
            bumpScale: - 0.05,
            color: this.color_ ? 0xffffff : 0x111111,
        });

        const QueenMesh: Object3D = Queen.meshQueen.clone(true);

        QueenMesh.traverse(function ( child: any ) {
            if ( child instanceof three.Mesh ) {
                child.material = material;
            }
        });
        QueenMesh.scale.set(100, 100, 100);
        QueenMesh.position.set(x * 100 - 50, 50, z * 100 - 57);
        QueenMesh.name = `${this.id}`;
        QueenMesh.children[0].castShadow = true;
        QueenMesh.children[0].receiveShadow = true;
        return this.mesh_ = QueenMesh;

    }

    static async getGeometry(): Promise<{}> {
        const loader = new three.OBJLoader();
        return await new Promise((resolve) => {
            loader.load('obj/QueenLight.obj', (object: Object3D) => {

                Queen.meshQueen = object;

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