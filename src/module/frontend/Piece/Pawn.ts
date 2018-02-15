import * as three from 'three';
import { Mesh } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
require('../lib/LoaderSupport');
require('../lib/OBJLoader2');

export class PawnModel {
    private mesh_: Mesh;
    private color_: boolean;
    private coordinate_: Coordinates;

    public constructor() {
        this._initMesh();
    }

    private _initMesh() {
        const loader = new three.OBJLoader2();
        loader.load( 'objs/Pawn.OBJ', (item: any) => {
            console.log(item);
        } );

    }
}