import * as three from 'three';
import { Mesh } from 'three';
import { BoxBufferGeometry } from 'three';
import { Cell } from './Cell';
import { array } from './types';
import { Coordinates } from '../../chess/types/Coordinates';

export class Board {
    private field_: Mesh;
    private cells_: Cell[] = [];

    public constructor() {
        this._initField();
        let isWhiteCell = true;
        for (let x = 1; x <= 8; x++) {
            isWhiteCell = !isWhiteCell;
            for (let z = 1; z <= 8; z++) {
                this.cells_.push(new Cell(array[x], array[z], isWhiteCell));
                isWhiteCell = !isWhiteCell;
            }
        }
    }

    public getBoard() {
        const group: three.Group = new three.Group();
        group.add(this.field_);
        for ( const item of this.cells_) {
            group.add(item.getCell());
        }
        return group;
    }

    public getCellById(id: number): Coordinates {
        const cell = this.cells_.filter((item: Cell) => {
            return item.id === id;
        })[0];
        return cell.coordinate;
    }

    private _initField() {
        const geometry = new three.BoxBufferGeometry(1800, 1800, 1800);
        const material = new three.MeshStandardMaterial( {
            map: null,
            bumpScale: - 0.05,
            color: 0x444444,
            metalness: 1.5,
            roughness: 1.0
        } );
        this.field_ = new three.Mesh(geometry, material);
        this.field_.position.y = -900;
        this.field_.castShadow = true;
        this.field_.receiveShadow = true;
    }
}