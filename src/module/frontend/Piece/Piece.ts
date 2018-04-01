import * as three from 'three';
import { Mesh, Scene, Object3D, Vector3, Group } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
require('../lib/OBJLoader');

export class Piece {
    public id: number;
    public coordinate_: Coordinates;
    
    protected mesh_: three.Group;
    protected color_: boolean;

    public constructor(id: number, position: Coordinates, bool: boolean) {
        this.id = id;
        this.coordinate_ = position;
        this.color_ = bool;
    }

    public getMesh() {
        return this.mesh_;
    }
}
