import * as three from 'three';
import { Mesh, Scene, Object3D, Vector3, Group } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
require('../lib/OBJLoader');
import { Piece } from './Piece';
import { numberColumn, charRow, array } from '../Board/types';
import { Coordinates as Position, KeyIndex } from '../../chess/types/Coordinates';
import { material } from '../Config/material';

export class Bishop extends Piece {
    static meshBishop: any = null;

    public initMesh(): Group {

        const x = array[this.coordinate_.num];
        const z = array[KeyIndex[this.coordinate_.char]];

        const BishopMesh = Bishop.meshBishop.clone(true);
        BishopMesh.traverse(function ( child: any ) {
            if ( child instanceof three.Mesh ) {
                child.material = material(this.color_);
            }
        }.bind(this));
        BishopMesh.scale.set(100, 100, 100);
        BishopMesh.position.set(x * 100 - 50, 50, z * 100 - 57);
        BishopMesh.name = `${this.id}`;
        BishopMesh.type = 'Piece';
        BishopMesh.children[0].castShadow = true;
        BishopMesh.children[0].receiveShadow = true;

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