import * as three from 'three';
import * as _ from 'lodash';

import { Board } from './Board/Board';
import { Cell } from './Board/Cell';
import { numberColumn, charRow, array } from './Board/types';
import { Pawn } from './Piece/Pawn';
import { Rook } from './Piece/Rook';
import { Knight } from './Piece/Knight';
import { Bishop } from './Piece/Bishop';
import { Queen } from './Piece/Queen';
import { King } from './Piece/King';
import { Group, Object3D } from 'three';
import { Piece } from './Piece/Piece';
import { Coordinates as Position, KeyIndex } from '../chess/types/Coordinates';
import { socket } from './main';
import { PieceResponse } from 'ws';

const chessId = Number(window.location.pathname.split('/')[2]);

export class Chess {
    public legalMove: any[];
    public playerColor: boolean;
    public queue: boolean;
    public changePawn: boolean;

    private pieceVec: three.Vector2 = new three.Vector2();
    private oldPiecePos: three.Vector2 = new three.Vector2();
    private newPiecePos: three.Vector2 = new three.Vector2();
    private movedMesh: three.Group;

    private board_: Board;
    private pieces_: Piece[];
    private newState: PieceResponse[];
    private groupMesh_: Group;
    private selectPiece: any;

    public constructor() {
        this.board_ = new Board();
        this.groupMesh_ = new three.Group();
        this.pieces_ = [];
        this.selectPiece = null;
    }

    public async initState(): Promise<Group> {
        await Promise.all([
            Pawn.getGeometry(),
            Rook.getGeometry(),
            Knight.getGeometry(),
            Bishop.getGeometry(),
            Queen.getGeometry(),
            King.getGeometry(),
            Board.getFont()
        ]);

        const board = await this.board_.getBoard();
        this.groupMesh_.add(board);

        return this.groupMesh_;
    }

    public async choisePiece(id: number): Promise<any> {
        const queue = this.selectPiece <= 16;
        const friend = queue ? id <= 16 : id >= 16;
        try {
            if (this.legalMove && this.legalMove.length && this.selectPiece && !friend) {
                const piece = this.pieces_.find(item => {
                    return item.id === id;
                });

                socket.emit('move', { ...piece.coordinate_ });

                this.legalMove = [];
                this.selectPiece = null;
            } else {

                socket.emit('choice piece', id);
                this.selectPiece = id;
            }
        } catch (error) {
            console.error(error);
        }

    }

    public async move(cellId: number): Promise<any> {
        try {
            const coordinate: Position = this.board_.getCellById(cellId);
            socket.emit('move', { ...coordinate });

            this.legalMove = [];
            this.selectPiece = null;
        } catch (error) {
            this.legalMove = [];
            console.error(error);
        }
    }


    public async choiceCell(cellId: number): Promise<any> {
        try {
            const coordinate: Position = this.board_.getCellById(cellId);
            socket.emit('choice cell', {
                ...coordinate
            });
        } catch (error) {
            console.error(error);
        }
    }

    public initPieces(pieces: PieceResponse[]) {
        pieces.forEach((item: PieceResponse) => {
            const piece = this.initPiece(item);
            this.pieces_.push(piece);
            this.groupMesh_.add(piece.initMesh());
        });
    }

    public updateState(pieces: PieceResponse[]) {
        this.newState = pieces;
        const movedPiece = this.getMovedPiece(pieces);

        if (movedPiece) {
            this.movedMesh = movedPiece.getMesh();
            this.oldPiecePos = new three.Vector2(movedPiece.getMesh().position.x, movedPiece.getMesh().position.z);

            this.newPiecePos = this.getNewPosition(movedPiece, pieces);

            this.pieceVec = new three.Vector2().subVectors(this.newPiecePos, this.oldPiecePos);
        }
    }

    public staticUpdateState(pieces: PieceResponse[]) {
        this.updatePieces(pieces);
    }

    public update(dt: number) {
        if (this.movedMesh) {
            this.movedMesh.position.x += this.pieceVec.x * 2 * dt;
            this.movedMesh.position.z += this.pieceVec.y * 2 * dt;

            const currentPos = this.get2Vector(this.movedMesh.position);
            const subVec = new three.Vector2().subVectors(currentPos, this.oldPiecePos);

            if (subVec.length() > this.pieceVec.length()) {

                this.movedMesh.position.x = this.newPiecePos.x;
                this.movedMesh.position.z = this.newPiecePos.y;
                this.pieceVec = new three.Vector2();
                this.movedMesh = null;
                this.oldPiecePos = null;
                this.newPiecePos = null;

                this.updatePieces(this.newState);
            }

        }
    }

    public clearShiftPawn() {
        const shftPawn = document.getElementById('shift');
        shftPawn.innerHTML = '';

    }

    public initShiftPawn() {
        const shiftPawn = document.createElement('div');
        shiftPawn.id = 'shift';
        document.body.appendChild(shiftPawn);
        let queen, bishop, knight, rook;
        queen = document.createElement('span');
        queen.id = 'Queen';
        queen.innerText = '♕';
        bishop = document.createElement('span');
        bishop.id = 'Bishop';
        bishop.innerText = '♗';
        knight = document.createElement('span');
        knight.id = 'Knight';
        knight.innerText = '♘';
        rook = document.createElement('span');
        rook.id = 'Rook';
        rook.innerText = '♖';

        shiftPawn.appendChild(queen);
        shiftPawn.appendChild(bishop);
        shiftPawn.appendChild(knight);
        shiftPawn.appendChild(rook);
    }

    private updatePieces(pieces: PieceResponse[]) {
        this.groupMesh_.children = this.groupMesh_.children.filter(item => {
            return item.type === 'Group' || item.type === 'swap';
        });
        this.pieces_ = [];
        pieces.forEach((item: any) => {
            if (item) {
                const piece = this.initPiece(item);
                this.pieces_.push(piece);
                this.groupMesh_.add(piece.initMesh());
            }
        });
    }

    private get2Vector(vector: three.Vector3): three.Vector2 {
        const { x, z } = vector;
        return new three.Vector2(x, z);
    }

    private getNewPosition(movedPiece: Piece, pieces: PieceResponse[]) {
        const newPos = pieces.find(item => {
            return item.id === movedPiece.id;
        });

        const x = array[movedPiece.coordinate_.num] * 100 - movedPiece.getMesh().position.x;
        const z = array[KeyIndex[movedPiece.coordinate_.char]] * 100 - movedPiece.getMesh().position.z;

        return new three.Vector2(array[newPos.position.num] * 100 - x, array[KeyIndex[newPos.position.char]] * 100 - z);
    }

    private getMovedPiece(pieces: PieceResponse[]) {
        return this.pieces_.find(item => {
            const piece = pieces.find(piece => {
                return piece.id === item.id;
            });

            return piece ? item.coordinate_.char !== piece.position.char ||
                item.coordinate_.num !== piece.position.num :
                false;
        });
    }

    private initPiece(piece: PieceResponse) {

        switch (piece.name) {
            case `Pawn`:
                return new Pawn(piece.id, piece.position, piece.color);

            case `Rook`:
                return new Rook(piece.id, piece.position, piece.color);

            case `Knight`:
                return new Knight(piece.id, piece.position, piece.color);

            case `Bishop`:
                return new Bishop(piece.id, piece.position, piece.color);

            case `Queen`:
                return new Queen(piece.id, piece.position, piece.color);

            case `King`:
                return new King(piece.id, piece.position, piece.color);

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