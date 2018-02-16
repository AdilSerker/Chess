import * as three from 'three';
import { Mesh, Scene, Object3D, Vector3, Group } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
require('../lib/OBJLoader');

let meshPawn: any = null;

export class Pawn {

    private mesh_: three.Group;
    private color_: boolean;
    private coordinate_: Coordinates;

    public async initMesh(x: number, z: number, bool: boolean): Promise<Group> {
        const material = new three.MeshStandardMaterial({
            map: null,
            bumpScale: - 0.05,
            color: bool ? 0xffffff : 0x000000,
            metalness: 0.5,
            roughness: 1.0
        });
        console.log(meshPawn, 'check static');
        if (meshPawn === null) {
            await this._getGeometry();
        }

        const pawnMesh = meshPawn.clone(true);
        pawnMesh.traverse(function ( child: any ) {
            if ( child instanceof three.Mesh ) {
                child.material = material;
            }
        });
        pawnMesh.scale.set(100, 100, 100);
        pawnMesh.position.set(x * 100 - 50, 50, z * 100 - 57);

        return this.mesh_ = pawnMesh;

    }

    private async _getGeometry(): Promise<{}> {
        const loader = new three.OBJLoader();
        return await new Promise((resolve) => {
            loader.load('obj/Pawn.OBJ', (object: Object3D) => {

                meshPawn = object;

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