import * as three from 'three';
import { Board } from './Board/Board';
import { numberColumn, charRow, array } from './Board/types';
import { Pawn } from './Piece/Pawn';
import { Group, Object3D } from 'three';

export class Chess {
    private board_: Board;
    private pieces_: Pawn[];
    static counter = 1;
    private groupMesh_: Group;

    public constructor() {
        this.board_ = new Board();
        this.groupMesh_ = new three.Group();
        this.pieces_ = [];
    }

    public async initState(): Promise<Group> {
        this.groupMesh_.add(this.board_.getBoard());
        await this._initWhitePiece();
        await this._initBlackPiece();
        return this.groupMesh_;
    }

    public getState(): Group {
        return this.groupMesh_;
    }

    private async _initPiece(x: number, z: number, bool: boolean): Promise<Object3D> {

        const pawn = new Pawn();
        const pawnMesh = await pawn.initMesh(x, z, bool);
        this.pieces_.push(pawn);
        return pawnMesh;
    }

    private async _initWhitePiece(): Promise<void> {

        const promises = [];

        for (let i = 1; i <= 8; ++i) {
            promises.push(this._initPiece(array[2], array[i], true));
        }
        const allMeshes: Object3D[] = await Promise.all(promises);
        allMeshes.forEach(item => {
            this.groupMesh_.add(item);
        });
    }

    private async _initBlackPiece(): Promise<void> {

        const promises = [];
        for (let i = 1; i <= 8; ++i) {
            promises.push(this._initPiece(array[7], array[i], false));
        }
        const allMeshes: Object3D[] = await Promise.all(promises);
        allMeshes.forEach(item => {
            this.groupMesh_.add(item);
        });
    }
}