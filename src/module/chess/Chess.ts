import { Board } from './Board/Board';
import { Piece } from './ChessPiece/Piece';
import { Bishop } from './ChessPiece/Bishop';
import { King } from './ChessPiece/King';
import { Knight } from './ChessPiece/Knight';
import { Pawn } from './ChessPiece/Pawn';
import { Queen } from './ChessPiece/Queen';
import { Rook } from './ChessPiece/Rook';
import { Coordinates, rowChar, rowCharIdx } from './types/coordinates';
import { PieceView } from './types/RenderField';

export class Chess {
    public pieces: Piece[];

    private board_: any;
    private status: boolean = false;
    private isQueueWhite_: boolean = true;
    private legalMove_: Coordinates[];
    private choicesPiece_: Piece;
    /**
     * PUBLIC
     */
    public constructor() {
        this.board_ = new Board();
        this.pieces = [];
    }

    public init(): void {
        let id: number = 0;
        if (!this.status) {
            this.status = true;
            /*
            *  init White Pieces
            */
            // for (let i = 1; i <= 8; ++i) {
            //     this.pieces.push(new Pawn({ char: rowChar[i], num: 2 }, 'white', ++id));
            // }
            this.pieces.push(new Rook({ char: 'a', num: 1 }, 'white', ++id));
            this.pieces.push(new Knight({ char: 'b', num: 1 }, 'white', ++id));
            this.pieces.push(new Bishop({ char: 'c', num: 1 }, 'white', ++id));
            this.pieces.push(new Queen({ char: 'd', num: 1 }, 'white', ++id));
            this.pieces.push(new King({ char: 'e', num: 1 }, 'white', ++id));
            this.pieces.push(new Bishop({ char: 'f', num: 1 }, 'white', ++id));
            this.pieces.push(new Knight({ char: 'g', num: 1 }, 'white', ++id));
            this.pieces.push(new Rook({ char: 'h', num: 1 }, 'white', ++id));

            /*
            *  init Black Piece
            */
            // for (let i = 1; i <= 8; ++i) {
            //     this.pieces.push(new Pawn({ char: rowChar[i], num: 7 }, 'black', ++id));
            // }
            this.pieces.push(new Rook({ char: 'a', num: 8 }, 'black', ++id));
            this.pieces.push(new Knight({ char: 'b', num: 8 }, 'black', ++id));
            this.pieces.push(new Bishop({ char: 'c', num: 8 }, 'black', ++id));
            this.pieces.push(new Queen({ char: 'd', num: 8 }, 'black', ++id));
            this.pieces.push(new King({ char: 'e', num: 8 }, 'black', ++id));
            this.pieces.push(new Bishop({ char: 'f', num: 8 }, 'black', ++id));
            this.pieces.push(new Knight({ char: 'g', num: 8 }, 'black', ++id));
            this.pieces.push(new Rook({ char: 'h', num: 8 }, 'black', ++id));

            this._setPieces(this.pieces);
        }

    }

    public choicePiece(id: number): void {
        const piecesPlayer: Piece[] = this.isQueueWhite_ ?
            this.pieces.filter(this._isWhite) :
            this.pieces.filter(this._isBlack);
        const piece: Piece = piecesPlayer.filter(item => {
            return item.id == id;
        })[0];

        if (piece) {
            this.choicesPiece_ = piece;
            this.legalMove_ = piece.legalMove = this._getLegalMove();
        }
        else {
            throw new Error('Not Acceptable');
        }
    }

    public move(coordinate: Coordinates): void {
        const board = this.board;
        const piece = this.choicesPiece_;

        if (JSON.stringify(this.legalMove)
                .indexOf(JSON.stringify(coordinate)) !== -1) {
            board[piece.position.char]
                [piece.position.num].piece = null;
            piece.move(coordinate);
            this.board_.insertPiece(piece);
            this.isQueueWhite_ = !this.isQueueWhite_;
        } else {
            throw new Error('Bad Request');
        }
    }

    public get legalMove(): Coordinates[] {
        return this.legalMove_;
    }

    public get state(): string | void {
        return JSON.stringify(this.board_.field);
    }

    public get board() {
        return this.board_.field;
    }

    public get controlPiece() {
        return this.choicesPiece_;
    }

    /**
     * PRIVATE
     */

    private _isWhite(piece: Piece): boolean {
        return piece.color === 'white';
    }

    private _isBlack(piece: Piece): boolean {
        return piece.color === 'black';
    }

    private _getLegalMove(): Coordinates[] {
        const board = this.board;
        const piece = this.choicesPiece_;
        let possibleMove: Coordinates[] = piece.select();

        if (piece.name === 'Rook') {
            console.log('this rook');
            possibleMove = this._rookMoveLegal(possibleMove);
        }
        if (piece.name === 'Knight') {
            console.log('this rnight');
            possibleMove = this._knightMoveLegal(possibleMove);
        }
        if (piece.name === 'Bishop') {
            console.log('this bishop');
            possibleMove = this._bishopMoveLegal(possibleMove);
        }
        if (piece.name === 'Queen') {
            console.log('this queen');
            possibleMove = this._queenMoveLegal(possibleMove);
        }
        if (piece.name === 'King') {
            console.log('this king');
            possibleMove = this._kingMoveLegal(possibleMove);
        }
        if (piece.name === 'Pawn') {
            console.log('this pawn');
            possibleMove = this._pawnMoveLegal(possibleMove);
        }

        return possibleMove;
    }

    private _rookMoveLegal(coordinates: Coordinates[]): Coordinates[] {
        const rook: Piece = this.controlPiece;
        const idx: number = rowChar.indexOf(this.controlPiece.position.char);
        const legalMove = [];

        for (let i = idx + 1; i <= 8; ++i) {
            console.log('test1');
            if (this.board[rowChar[i]][rook.position.num].piece &&
                    this.board[rowChar[i]][rook.position.num].piece.color === rook.color) {
                break;
            } else if (this.board[rowChar[i]][rook.position.num].piece &&
                this.board[rowChar[i]][rook.position.num].piece.color !== rook.color) {
                legalMove.push({
                    char: rowChar[i],
                    num: rook.position.num
                });
                break;
            } else {
                legalMove.push({
                    char: rowChar[i],
                    num: rook.position.num
                });
            }
        }

        for (let j = rook.position.num - 1; j > 0; --j) {
            if (this.board[rowChar[idx]][j].piece &&
                    this.board[rowChar[idx]][j].piece.color === rook.color) {
                break;
            } else if (this.board[rowChar[idx]][j].piece &&
                this.board[rowChar[idx]][j].piece.color !== rook.color) {
                legalMove.push({
                    char: rowChar[idx],
                    num: j
                });
                break;
            } else {
                legalMove.push({
                    char: rowChar[idx],
                    num: j
                });
            }
        }

        for (let j = rook.position.num + 1; j <= 8; ++j) {
            if (this.board[rowChar[idx]][j].piece &&
                    this.board[rowChar[idx]][j].piece.color === rook.color) {
                break;
            } else if (this.board[rowChar[idx]][j].piece &&
                this.board[rowChar[idx]][j].piece.color !== rook.color) {
                legalMove.push({
                    char: rowChar[idx],
                    num: j
                });
                break;
            } else {
                legalMove.push({
                    char: rowChar[idx],
                    num: j
                });
            }
        }

        for (let i = idx - 1; i > 0; --i) {
            if (this.board[rowChar[i]][rook.position.num].piece &&
                    this.board[rowChar[i]][rook.position.num].piece.color === rook.color) {
                break;
            } else if (this.board[rowChar[i]][rook.position.num].piece &&
                this.board[rowChar[i]][rook.position.num].piece.color !== rook.color) {
                legalMove.push({
                    char: rowChar[i],
                    num: rook.position.num
                });
                break;
            } else {
                legalMove.push({
                    char: rowChar[i],
                    num: rook.position.num
                });
            }
        }

        return legalMove;
    }

    private _knightMoveLegal(coordinates: Coordinates[]): Coordinates[] {
        return coordinates;
    }

    private _bishopMoveLegal(coordinates: Coordinates[]): Coordinates[] {
        return coordinates;
    }

    private _queenMoveLegal(coordinates: Coordinates[]): Coordinates[] {
        return coordinates;
    }

    private _kingMoveLegal(coordinates: Coordinates[]): Coordinates[] {
        return coordinates;
    }

    private _pawnMoveLegal(coordinates: Coordinates[]): Coordinates[] {
        return coordinates;
    }

    private _setPieces(pieces: Piece[]): void {
        pieces.forEach(piece => {
            this.board_.insertPiece(piece);
        });
    }
}