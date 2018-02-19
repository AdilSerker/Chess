import * as three from 'three';
import { Mesh, Scene, Object3D, Vector3, Group } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
require('../lib/OBJLoader');
import { Piece } from './Piece';
import { numberColumn, charRow, array } from '../Board/types';
import { Coordinates as Position, KeyIndex } from '../../chess/types/Coordinates';


export class Knight extends Piece {
    static meshKnight: any = null;


    public initMesh(): Group {

        const x = array[this.coordinate_.num];
        const z = array[KeyIndex[this.coordinate_.char]];

        const material = new three.MeshStandardMaterial({
            map: null,
            bumpScale: - 0.05,
            color: this.color_ ? 0xffffff : 0x111111,
        });


        const knightMesh = Knight.meshKnight.clone(true);
        knightMesh.traverse(function ( child: any ) {
            if ( child instanceof three.Mesh ) {
                child.material = material;
            }
        });
        knightMesh.scale.set(100, 100, 100);
        knightMesh.name = `${this.id}`;
        if (this.color_) {
            knightMesh.rotation.y = Math.PI * 0.5;
            knightMesh.position.set(x * 100 - 60, 50, z * 100 + 45);
        } else {
            knightMesh.rotation.y = - Math.PI * 0.5;
            knightMesh.position.set(x * 100 + 60, 50, z * 100 - 45);
        }
        knightMesh.castShadow = true;
        knightMesh.receiveShadow = true;
        return this.mesh_ = knightMesh;

    }

    static async getGeometry(): Promise<{}> {
        const loader = new three.OBJLoader();
        return await new Promise((resolve) => {
            loader.load('obj/KnightLight.obj', (object: Object3D) => {

                Knight.meshKnight = object;

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