import * as three from 'three';
import { Board } from './Board/Board';
import { numberColumn, charRow, array } from './Board/types';
import { Pawn } from './Piece/Pawn';
import { Rook } from './Piece/Rook';
import { Knight } from './Piece/Knight';
import { Bishop } from './Piece/Bishop';
import { Queen } from './Piece/Queen';
import { King } from './Piece/King';
import { Group, Object3D } from 'three';
import { Piece as AttrPiece } from '../chess/ChessPiece/Piece';
import { Coordinates as Position } from '../chess/types/Coordinates';

import axios, { AxiosPromise } from 'axios';

export class Chess {
    private board_: Board;
    private pieces_: any[];
    static counter = 1;
    private groupMesh_: Group;

    public constructor() {
        this.board_ = new Board();
        this.groupMesh_ = new three.Group();
        this.pieces_ = [];
    }

    public async initState(): Promise<Group> {

        await Pawn.getGeometry();
        await Rook.getGeometry();
        await Knight.getGeometry();
        await Bishop.getGeometry();
        await Queen.getGeometry();
        await King.getGeometry();

        const status = await axios.get('http://localhost:8888/api/chess/status');
        let chessState: any;
        let pieces: any;
        if (!status.data) {
            await axios.get('http://localhost:8888/api/chess/start');
            pieces = await axios.get('http://localhost:8888/api/chess/piece');
        } else {
            chessState = await axios.get('http://localhost:8888/api/chess');
            pieces = await axios.get('http://localhost:8888/api/chess/piece');
        }

        this.groupMesh_.add(this.board_.getBoard());
        pieces.data.forEach((item: AttrPiece) => {
            this.initPiece(item);
        });

        return this.groupMesh_;
    }

    private initPiece(piece: AttrPiece) {
        switch (piece.name) {
            case 'Pawn':
                this._initPawn(piece.id, piece.position, piece.color);
                break;
        }
    }

    public getState(): Group {
        return this.groupMesh_;
    }

    private _initPawn(id: number, position: Position, bool: boolean): Object3D {
        const pawn = new Pawn(id, position, bool);
        const pawnMesh = pawn.initMesh(x, z, bool);

        this.pieces_.push(pawn);
        return pawnMesh;
    }

    private _initRook(x: number, z: number, bool: boolean): Object3D {
        const rook = new Rook();
        this.pieces_.push(rook);

        const rookMesh = rook.initMesh(x, z, bool);
        return rookMesh;
    }

    private _initKnight(x: number, z: number, bool: boolean): Object3D {
        const knight = new Knight();
        this.pieces_.push(knight);

        const knightMesh = knight.initMesh(x, z, bool);
        return knightMesh;
    }

    private _initBishop(x: number, z: number, bool: boolean): Object3D {
        const bishop = new Bishop();
        this.pieces_.push(bishop);

        const bishopMesh = bishop.initMesh(x, z, bool);
        return bishopMesh;
    }

    private _initQueen(x: number, z: number, bool: boolean): Object3D {
        const queen = new Queen();
        this.pieces_.push(queen);

        const queenMesh = queen.initMesh(x, z, bool);
        return queenMesh;
    }

    private _initKing(x: number, z: number, bool: boolean): Object3D {
        const king = new King();
        this.pieces_.push(king);

        const kingMesh = king.initMesh(x, z, bool);
        return kingMesh;
    }
}
// this._initWhitePiece();
// this._initWhiteRooks();
// this._initWhiteKnight();
// this._initWhiteBishop();
// this._initWhiteQueen();
// this._initWhiteKing();

// this._initBlackPiece();
// this._initBlackRooks();
// this._initBlackKnight();
// this._initBlackBishop();
// this._initBlackQueen();
// this._initBlackKing();

    //

    // private _initWhiteKing(): void {
    //     this.groupMesh_.add(this._initKing(array[1], array[5], true));
    // }

    // private _initBlackKing(): void {
    //     this.groupMesh_.add(this._initKing(array[8], array[5], false));
    // }

    // private _initWhiteQueen(): void {
    //     this.groupMesh_.add(this._initQueen(array[1], array[4], true));
    // }

    // private _initBlackQueen(): void {
    //     this.groupMesh_.add(this._initQueen(array[8], array[4], false));
    // }


    // private _initWhiteBishop(): void {
    //     this.groupMesh_.add(this._initBishop(array[1], array[3], true));
    //     this.groupMesh_.add(this._initBishop(array[1], array[6], true));
    // }

    // private _initBlackBishop(): void {
    //     this.groupMesh_.add(this._initBishop(array[8], array[3], false));
    //     this.groupMesh_.add(this._initBishop(array[8], array[6], false));
    // }

    // private _initWhiteKnight(): void {
    //     this.groupMesh_.add(this._initKnight(array[1], array[2], true));
    //     this.groupMesh_.add(this._initKnight(array[1], array[7], true));
    // }

    // private _initBlackKnight(): void {
    //     this.groupMesh_.add(this._initKnight(array[8], array[2], false));
    //     this.groupMesh_.add(this._initKnight(array[8], array[7], false));
    // }

    // private _initWhiteRooks(): void {
    //     this.groupMesh_.add(this._initRook(array[1], array[1], true));
    //     this.groupMesh_.add(this._initRook(array[1], array[8], true));
    // }

    // private _initBlackRooks(): void {
    //     this.groupMesh_.add(this._initRook(array[8], array[1], false));
    //     this.groupMesh_.add(this._initRook(array[8], array[8], false));
    // }

    // private _initWhitePiece(): void {
    //     for (let i = 1; i <= 8; ++i) {
    //         this.groupMesh_.add(this._initPiece(array[2], array[i], true));
    //     }
    // }

    // private _initBlackPiece(): void {
    //     for (let i = 1; i <= 8; ++i) {
    //         this.groupMesh_.add(this._initPiece(array[7], array[i], false));
    //     }
    // }