import { Coordinates, KeyIndex, CharIndex } from './types/Coordinates';
import { Board } from './Board/Board';
import { Piece } from './ChessPiece/Piece';
import { Bishop } from './ChessPiece/Bishop';
import { King } from './ChessPiece/King';
import { Knight } from './ChessPiece/Knight';
import { Pawn } from './ChessPiece/Pawn';
import { Queen } from './ChessPiece/Queen';
import { Rook } from './ChessPiece/Rook';
import * as _ from 'lodash';


export class Chess {

    private pieces_: Piece[];
    private board_: Board;
    private status: boolean = false;
    private queue: boolean = true;
    private legalMoves_: Coordinates[];
    private choicesPiece_: Piece;

    private pieceId: number;

    private dumpBoard: Board;
    private dumpPiece: Piece[];
    private dumpQueue: boolean;

    /**
     * PUBLIC
     */

    public constructor() {
        this.board_ = new Board();
        this.pieces_ = [];
        this.pieceId = 0;
    }

    public init(): void {

        if (!this.status) {
            this.status = true;

            this._initWhitePieces();
            this._initBlackPieces();

            this._setPieces(this.pieces_);
        }
    }

    public choicePiece(id: number): Coordinates[] {
        try {
            const piece: Piece = this._getPiece(id);

            if (piece) {
                if (piece.name === 'Pawn') {
                    this.choicesPiece_ = piece;
                    this.legalMoves_ = piece.select(this.board_);
                    console.log(this.legalMoves_);
                } else {
                    this.choicesPiece_ = piece;
                    this.legalMoves_ = piece.select(this.board_);
                    console.log(this.legalMoves_);
                }

                this.board_.flashCells(this.legalMoves_);

                return this.legalMoves_;
            } else {
                throw new Error('Not Acceptable');
            }
        } catch (error) {
            if (error.message === 'Not Acceptable') {
                throw new Error('opponent\'s move')
            } else {
                throw error;
            }
        }
    } 

    public move(coordinate: Coordinates): Piece[] {
        try {
            this._makeDump();
            this._move(coordinate);

            if (this._isCheck()) {
                this._revert();
                throw new Error('move on check');
            } else {
                this.queue = !this.queue;
                
                return this.pieces_;
            }
        } catch (error) {
            console.log(error);
            if (error.message === 'Bad Request') {

                throw new Error('opponent\'s move')
            } else {
                throw error;
                
            }
        }
    }

    public getStatus() {
        return this.status;
    }

    public getState(): Board | void {
        return this.board_;
    }

    public pieces(bool?: boolean) {
        return this._getPieces(bool);
    }


    /**
     * PRIVATE
     */

    private _getPieces(bool?: boolean): Piece[] {
        let pieces: Piece[] = [];
        if (bool) {
            pieces = this.pieces_.filter(item => {
                return item.color === bool;
            });
        } else if (bool !== undefined) {
            pieces = this.pieces_.filter(item => {
                return item.color === bool;
            });
        } else {
            pieces = this.pieces_.slice();
        }
        return pieces;

    }

    private _initWhitePieces() {
        for (let i = 1; i <= 8; ++i) {
            this.pieces_.push(new Pawn({ char: CharIndex[i], num: 2 }, true, ++this.pieceId));
        }
        this.pieces_.push(new Rook({ char: 'a', num: 1 }, true, ++this.pieceId));
        this.pieces_.push(new Rook({ char: 'h', num: 1 }, true, ++this.pieceId));
        this.pieces_.push(new Knight({ char: 'b', num: 1 }, true, ++this.pieceId));
        this.pieces_.push(new Knight({ char: 'g', num: 1 }, true, ++this.pieceId));
        this.pieces_.push(new Bishop({ char: 'c', num: 1 }, true, ++this.pieceId));
        this.pieces_.push(new Bishop({ char: 'f', num: 1 }, true, ++this.pieceId));
        this.pieces_.push(new Queen({ char: 'd', num: 1 }, true, ++this.pieceId));
        this.pieces_.push(new King({ char: 'e', num: 1 }, true, ++this.pieceId));
    }

    private _initBlackPieces() {
        for (let i = 1; i <= 8; ++i) {
            this.pieces_.push(new Pawn({ char: CharIndex[i], num: 7 }, false, ++this.pieceId));
        }
        this.pieces_.push(new Rook({ char: 'a', num: 8 }, false, ++this.pieceId));
        this.pieces_.push(new Rook({ char: 'h', num: 8 }, false, ++this.pieceId));
        this.pieces_.push(new Knight({ char: 'b', num: 8 }, false, ++this.pieceId));
        this.pieces_.push(new Knight({ char: 'g', num: 8 }, false, ++this.pieceId));
        this.pieces_.push(new Bishop({ char: 'c', num: 8 }, false, ++this.pieceId));
        this.pieces_.push(new Bishop({ char: 'f', num: 8 }, false, ++this.pieceId));
        this.pieces_.push(new Queen({ char: 'd', num: 8 }, false, ++this.pieceId));
        this.pieces_.push(new King({ char: 'e', num: 8 }, false, ++this.pieceId));
    }

    private _isLegalMove(coordinate: Coordinates): boolean {
        return JSON.stringify(this.legalMoves_).indexOf(
            JSON.stringify(coordinate)) !== -1;
    }

    private _move(coordinate: Coordinates): void {
        let char = this.choicesPiece_.position.char,
            num = this.choicesPiece_.position.num,
            index = KeyIndex[char],
            board = this.board_;

        if (this._isLegalMove(coordinate)) {
            board.select(char, num).emptyCell();

            if (!board.select(coordinate.char, coordinate.num).isEmpty()) {
                board.select(coordinate.char, coordinate.num).emptyCell();
                this.pieces_ = this.pieces_.filter(piece => {
                    return piece.position.char === coordinate.char
                        && piece.position.num === coordinate.num ?
                        false : true;
                });
            }

            if (this.choicesPiece_.name === 'King') {
                if (KeyIndex[coordinate.char] - KeyIndex[char] === 2 ||
                    KeyIndex[char] - KeyIndex[coordinate.char] === 2) {

                    this._castling(coordinate);
                }
            }

            if (this.choicesPiece_.name === 'Pawn') {
                
                if (this.queue) {
                    
                    if (this.choicesPiece_.isNotMove() && 
                        coordinate.num - num === 2) {
                            
                            this.choicesPiece_.enPassant = true;
                    } else
                    if (!board.select(coordinate.char, coordinate.num - 1).isEmpty() &&
                        board.select(coordinate.char, coordinate.num - 1).getPiece().enPassant) {

                        const id = board.select(coordinate.char, coordinate.num - 1).getPiece().id;
                        board.select(coordinate.char, coordinate.num - 1).emptyCell();

                        this.pieces_ = this.pieces_.filter(item => {
                            return item.id !== id;
                        });

                        this.pieces_.forEach(item => {
                            item.enPassant = false;
                        });

                    } else {
                        this.pieces_.forEach(item => {
                            item.enPassant = false;
                        });
                    }
                } else {
                    if(this.choicesPiece_.isNotMove() && 
                        num - coordinate.num === 2) {
                            this.choicesPiece_.enPassant = true;
                    } else
                    if (!board.select(coordinate.char, coordinate.num - 1).isEmpty() &&
                        board.select(coordinate.char, coordinate.num + 1).getPiece().enPassant) {
                        
                        const id = board.select(coordinate.char, coordinate.num + 1).getPiece().id;
                        board.select(coordinate.char, coordinate.num + 1).emptyCell();

                        this.pieces_ = this.pieces_.filter(item => {
                            return item.id !== id;
                        });

                        this.pieces_.forEach(item => {
                            item.enPassant = false;
                        });

                    } else {
                        this.pieces_.forEach(item => {
                            item.enPassant = false;
                        });
                    }
                }
            } else {
                this.pieces_.forEach(item => {
                    item.enPassant = false;
                });
            }

            this.choicesPiece_.move(coordinate);

            this.board_.insertPiece(this.choicesPiece_);

            this.board_.flashOffAllCells();

            this.legalMoves_ = [];

        } else {
            throw new Error('Bad Request');
        }
    }

    private _castling(coordinate: Coordinates): void {
        if (this.queue) {
            if (KeyIndex[coordinate.char] - KeyIndex[this.choicesPiece_.position.char] === 2 &&
                !this._isAttackedSquare({
                    char: CharIndex[KeyIndex[this.choicesPiece_.position.char] + 1],
                    num: this.choicesPiece_.position.num
                })
            ) {
                const rook = this.board_.select('h', 1).getPiece();
                this.board_.select('h', 1).emptyCell();
                rook.move({ char: 'f', num: 1 });
                this.board_.insertPiece(rook);
            }
            if (KeyIndex[this.choicesPiece_.position.char] - KeyIndex[coordinate.char] === 2 &&
                !this._isAttackedSquare({
                    char: CharIndex[KeyIndex[this.choicesPiece_.position.char] - 1],
                    num: this.choicesPiece_.position.num
                })
            ) {
                const rook = this.board_.select('a', 1).getPiece();
                this.board_.select('a', 1).emptyCell();
                rook.move({ char: 'd', num: 1 });
                this.board_.insertPiece(rook);
            }
        } else {
            if (KeyIndex[coordinate.char] - KeyIndex[this.choicesPiece_.position.char] === 2 &&
                !this._isAttackedSquare({
                    char: CharIndex[KeyIndex[this.choicesPiece_.position.char] + 1],
                    num: this.choicesPiece_.position.num
                })
            ) {
                const rook = this.board_.select('h', 8).getPiece();
                this.board_.select('h', 8).emptyCell();
                rook.move({ char: 'f', num: 8 });
                this.board_.insertPiece(rook);
            }
            if (KeyIndex[this.choicesPiece_.position.char] - KeyIndex[coordinate.char] === 2 &&
                !this._isAttackedSquare({
                    char: CharIndex[KeyIndex[this.choicesPiece_.position.char] - 1],
                    num: this.choicesPiece_.position.num
                })
            ) {
                const rook = this.board_.select('a', 8).getPiece();
                this.board_.select('a', 8).emptyCell();
                rook.move({ char: 'd', num: 8 });
                this.board_.insertPiece(rook);
            }
        }
    }

    private _isAttackedSquare(coordinate: Coordinates): boolean {
        let cellAttack: Coordinates[] = [];

        const opponentPieces: Piece[] = this._getPieces(!this.queue);
        opponentPieces.forEach(function (item: Piece) {
            cellAttack = cellAttack.concat(item.select(this.board_));
        }.bind(this));

        return JSON.stringify(cellAttack).indexOf(
            JSON.stringify(coordinate)) !== -1;
    }

    private _makeDump() {
        this.dumpBoard = _.cloneDeep(this.board_);
        this.dumpPiece = this.pieces_.map(item => {
            return _.cloneDeep(item);
        });
        this.dumpQueue = this.queue;
    }

    private _revert() {
        this.board_ = _.cloneDeep(this.dumpBoard);
        this.queue = this.dumpQueue;
        this.pieces_ = this.dumpPiece.map(item => {
            return _.cloneDeep(item);
        });
    }

    private _isCheck(): boolean {
        let cellAttack: Coordinates[] = [];

        const opponentPieces: Piece[] = this._getPieces(!this.queue);
        opponentPieces.forEach(function (item: Piece) {
            cellAttack = cellAttack.concat(item.select(this.board_));
        }.bind(this));
        
        const kingPosition = this.queue ?
            this._getPiece(16).position : this._getPiece(32).position;

        return JSON.stringify(cellAttack).indexOf(
            JSON.stringify(kingPosition)) !== -1;
    }

    private _isWhite(piece: Piece): boolean {
        return piece.color === true;
    }

    private _isBlack(piece: Piece): boolean {
        return piece.color === false;
    }

    private _setPieces(pieces_: Piece[]): void {
        pieces_.forEach(piece => {
            this.board_.insertPiece(piece);
        });
    }

    private _getPiece(id: number): Piece {
        const pieces_Player: Piece[] = this.queue ?
            this.pieces_.filter(this._isWhite) :
            this.pieces_.filter(this._isBlack);
        const piece: Piece = pieces_Player.filter(item => {
            return item.id == id;
        })[0];
        return piece;
    }
}