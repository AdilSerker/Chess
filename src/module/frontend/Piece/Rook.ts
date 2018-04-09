import * as three from 'three';
import { Mesh, Scene, Object3D, Vector3, Group } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
require('../lib/OBJLoader');
import { Piece } from './Piece';
import { numberColumn, charRow, array } from '../Board/types';
import { Coordinates as Position, KeyIndex } from '../../chess/types/Coordinates';
import { material } from '../Config/material';

export class Rook extends Piece {
    static meshRook: any = null;


    public initMesh(): Group {

        const x = array[this.coordinate_.num];
        const z = array[KeyIndex[this.coordinate_.char]];

        const rookMesh = Rook.meshRook.clone(true);
        rookMesh.traverse(function ( child: any ) {
            if ( child instanceof three.Mesh ) {
                child.material = material(this.color_);
            }
        }.bind(this));
        rookMesh.scale.set(100, 100, 100);
        rookMesh.position.set(x * 100 - 50, 50, z * 100 - 57);
        rookMesh.name = `${this.id}`;
        rookMesh.type = 'Piece';
        rookMesh.children[0].castShadow = true;
        rookMesh.children[0].receiveShadow = true;
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
                    // console.log( Math.round(percentComplete) + '% downloaded' );
                }
            }, (err) => { });
        });
    }

    public getPiece() {
        return this.mesh_;
    }
}