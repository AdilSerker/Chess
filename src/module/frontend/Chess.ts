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
import { Piece } from '../chess/ChessPiece/Piece';
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

        let  pieces: any;

        const status = (await axios.get('http://localhost:8888/api/chess/status')).data;

        if (!status) {
            console.log('новая сессия');
            await axios.get('http://localhost:8888/api/chess/start');
            pieces = await axios.get('http://localhost:8888/api/chess/piece');
        } else {
            console.log('восстановление сессии');
            pieces = await axios.get('http://localhost:8888/api/chess/piece');
        }

        this.groupMesh_.add(this.board_.getBoard());

        pieces.data.forEach((item: any) => {
            if (this.initPiece(item))
                this.groupMesh_.add(this.initPiece(item));
        });
        this.groupMesh_.castShadow = true;
        this.groupMesh_.receiveShadow = true;
        return this.groupMesh_;
    }

    private initPiece(piece: any): Object3D {

        switch (piece.name_) {
            case 'Pawn':
                return this._initPawn(piece.id_, piece.pos_, piece.color_);

            case 'Rook':
                return this._initRook(piece.id_, piece.pos_, piece.color_);

            case 'Knight':
                return this._initKnight(piece.id_, piece.pos_, piece.color_);

            case 'Bishop':
                return this._initBishop(piece.id_, piece.pos_, piece.color_);

            case 'Queen':
                return this._initQueen(piece.id_, piece.pos_, piece.color_);

            case 'King':
                return this._initKing(piece.id_, piece.pos_, piece.color_);

            default:
                return null;
        }
    }

    private _initPawn(id: number, position: Position, bool: boolean): Object3D {
        const pawn = new Pawn(id, position, bool);
        this.pieces_.push(pawn);

        return pawn.initMesh();
    }

    private _initRook(id: number, position: Position, bool: boolean): Object3D {
        const rook = new Rook(id, position, bool);
        this.pieces_.push(rook);

        return rook.initMesh();
    }

    private _initKnight(id: number, position: Position, bool: boolean): Object3D {
        const knight = new Knight(id, position, bool);
        this.pieces_.push(knight);

        return knight.initMesh();
    }

    private _initBishop(id: number, position: Position, bool: boolean): Object3D {
        const bishop = new Bishop(id, position, bool);
        this.pieces_.push(bishop);

        return bishop.initMesh();
    }

    private _initQueen(id: number, position: Position, bool: boolean): Object3D {
        const queen = new Queen(id, position, bool);
        this.pieces_.push(queen);

        return queen.initMesh();
    }

    private _initKing(id: number, position: Position, bool: boolean): Object3D {
        const king = new King(id, position, bool);
        this.pieces_.push(king);

        return king.initMesh();
    }
}