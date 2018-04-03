import * as three from 'three';
import { Mesh } from 'three';
import { BoxBufferGeometry } from 'three';
import { Coordinates } from '../../chess/types/Coordinates';
import { numberColumn, charRow } from './types';

export class Cell {
    static counter: number = 0;

    private id_: number;
    private color_: boolean;
    private flash_: boolean;
    private cell_: Mesh;
    private coordinate_: Coordinates;

    public constructor(x: number, z: number, bool: boolean, type?: string) {
        this.id_ = ++ Cell.counter;
        const geometry = new three.BoxBufferGeometry(200, 50, 200);
        const material = new three.MeshPhongMaterial( {
            // color: bool ? 0xaeaeae : 0x202020,
            color: bool ? 0xeeeeee : 0x000000,
            side: three.DoubleSide,
            wireframe: false
        } );
        this.color_ = bool;
        this.cell_ = new three.Mesh(geometry, material);
        this.cell_.receiveShadow = true;
        this.cell_.position.y = 20;
        this.cell_.name = `${this.id_}`;
        this.cell_.position.x = x * 100;
        this.cell_.position.z = z * 100;
        this.cell_.type = 'Cell';
        if (type) {
            this.cell_.type = type;
        }

        this.coordinate_ = {
            char: charRow[z.toString()],
            num: numberColumn[x.toString()]
        };
    }

    public get id() {
        return this.id_;
    }

    public getCell() {
        return this.cell_;
    }

    public get coordinate() {
        return { ...this.coordinate_ };
    }

    public set color(bool: boolean) {
        this.color_ = bool;
    }
}