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
import { Piece as PieceFront } from './Piece/Piece'
import { Coordinates as Position } from '../chess/types/Coordinates';
import { socket } from './main';


// import axios, { AxiosPromise } from 'axios';

// import { ipAddress } from '../../config/server';



let chessId = Number(window.location.pathname.split('/')[2]);


export class Chess {
    public legalMove: any[];
    public playerColor: boolean;
    public queue: boolean;

    private board_: Board;
    private pieces_: PieceFront[];
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

        const board = await this.board_.getBoard()
        this.groupMesh_.add(board);

        return this.groupMesh_;
    }

    public async choisePiece(id: number): Promise<any> {
        const queue = this.selectPiece <= 16;
        const friend = queue ? id <= 16 : id >= 16;
        try {
            if (this.legalMove && this.legalMove.length && this.selectPiece && !friend) {
                const piece = this.pieces_.filter(item => {
                    return item.id === id;
                })[0];

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
    
    public updateState(pieces: any[]) {
        this.groupMesh_.children = this.groupMesh_.children.filter(item => {
            return item.type === 'Group';
        });
        this.pieces_ = [];
        pieces.forEach((item: any) => {
            if (item)
                this.groupMesh_.add(this.initPiece(item));
            });
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


// сделать апдейт менее заебистым
    private async update(pieces: any[]) {
        this.groupMesh_.children = this.groupMesh_.children.slice(0, 1);
        this.pieces_ = [];
        pieces.forEach((item: any) => {
            if (item)
                this.groupMesh_.add(this.initPiece(item));
        });
    }

    private initPiece(piece: any): Object3D {

        switch (piece.name_) {
            case `Pawn`:
                return this._initPawn(piece.id_, piece.pos_, piece.color_);

            case `Rook`:
                return this._initRook(piece.id_, piece.pos_, piece.color_);

            case `Knight`:
                return this._initKnight(piece.id_, piece.pos_, piece.color_);

            case `Bishop`:
                return this._initBishop(piece.id_, piece.pos_, piece.color_);

            case `Queen`:
                return this._initQueen(piece.id_, piece.pos_, piece.color_);

            case `King`:
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