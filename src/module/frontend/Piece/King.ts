import * as three from 'three';
import { Mesh, Scene, Object3D, Vector3, Group } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
require('../lib/OBJLoader');
import { Piece } from './Piece';
import { material } from '../Config/material';
import { numberColumn, charRow, array } from '../Board/types';
import { Coordinates as Position, KeyIndex } from '../../chess/types/Coordinates';

export class King extends Piece {
    static meshKing: any = null;

    public initMesh(): Group {
        const x = array[this.coordinate_.num];
        const z = array[KeyIndex[this.coordinate_.char]];

        const KingMesh = King.meshKing.clone(true);
        KingMesh.traverse(function ( child: any ) {
            if ( child instanceof three.Mesh ) {
                child.material = material(this.color_);
            }
        }.bind(this));
        KingMesh.scale.set(100, 100, 100);
        KingMesh.rotation.y = Math.PI * 0.5;
        KingMesh.position.set(x * 100 - 60, 50, z * 100 + 50);
        KingMesh.name = `${this.id}`;
        KingMesh.type = 'Piece';
        KingMesh.children[0].castShadow = true;
        KingMesh.children[0].receiveShadow = true;

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
                    // console.log( Math.round(percentComplete) + '% downloaded' );
                }
            }, (err) => { });
        });
    }

    public getPiece() {
        return this.mesh_;
    }
}