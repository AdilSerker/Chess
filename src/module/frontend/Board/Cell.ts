import * as three from 'three';
import { Mesh } from 'three';
import { BoxBufferGeometry } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
import { numberColumn, charRow } from './types';

export class Cell {
    static counter: number = 0;

    private id_: number;
    private color_: boolean;
    private cell_: Mesh;
    private coordinate_: Coordinates;

    public constructor(x: number, z: number, bool: boolean) {
        this.id_ = ++ Cell.counter;
        const geometry = new three.BoxBufferGeometry(200, 200, 200);
        const material = new three.MeshStandardMaterial( {
            map: null,
            bumpScale: - 0.05,
            color: bool ? 0xbfbfbf : 0x202020,
            metalness: 0.5,
            roughness: 1.0
        } );
        this.color_ = bool;
        this.cell_ = new three.Mesh(geometry, material);
        this.cell_.position.y = -50;

        this.cell_.position.x = x * 100;
        this.cell_.position.z = z * 100;

        this.coordinate_ = {
            char: charRow[z.toString()],
            num: numberColumn[x.toString()]
        };
    }

    public getCell() {
        return this.cell_;
    }

    public set color(bool: boolean) {
        this.color_ = bool;
    }
}