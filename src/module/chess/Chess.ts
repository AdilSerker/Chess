import { Coordinates, KeyIndex, CharIndex } from './types/Coordinates';
import { Board } from './Board/Board';
import { Piece } from './ChessPiece/Piece';
import { Bishop } from './ChessPiece/Bishop';
import { King } from './ChessPiece/King';
import { Knight } from './ChessPiece/Knight';
import { Pawn } from './ChessPiece/Pawn';
import { Queen } from './ChessPiece/Queen';
import { Rook } from './ChessPiece/Rook';


export class Chess {

    private pieces_: Piece[];
    private board_: Board;
    private status: boolean = false;
    private isQueueWhite_: boolean = true;
    private legalMove_: Coordinates[];
    private choicesPiece_: Piece;

    /**
     * PUBLIC
     */
    public constructor() {
        this.board_ = new Board();
        this.pieces_ = [];
    }

    public init(): void {
        let id: number = 0;
        if (!this.status) {
            this.status = true;
            /*
            *  init White Pieces_
            */

            for (let i = 1; i <= 8; ++i) {
                this.pieces_.push(new Pawn({ char: CharIndex[i], num: 2 }, true, ++id));
            }
            this.pieces_.push(new Rook({ char: 'a', num: 1 }, true, ++id));
            this.pieces_.push(new Rook({ char: 'h', num: 1 }, true, ++id));
            this.pieces_.push(new Knight({ char: 'b', num: 1 }, true, ++id));
            this.pieces_.push(new Knight({ char: 'g', num: 1 }, true, ++id));
            this.pieces_.push(new Bishop({ char: 'c', num: 1 }, true, ++id));
            this.pieces_.push(new Bishop({ char: 'f', num: 1 }, true, ++id));
            this.pieces_.push(new Queen({ char: 'd', num: 1 }, true, ++id));
            this.pieces_.push(new King({ char: 'e', num: 1 }, true, ++id));

            /*
            *  init Black Piece
            */

            for (let i = 1; i <= 8; ++i) {
                this.pieces_.push(new Pawn({ char: CharIndex[i], num: 7 }, false, ++id));
            }
            this.pieces_.push(new Rook({ char: 'a', num: 8 }, false, ++id));
            this.pieces_.push(new Rook({ char: 'h', num: 8 }, false, ++id));
            this.pieces_.push(new Knight({ char: 'b', num: 8 }, false, ++id));
            this.pieces_.push(new Knight({ char: 'g', num: 8 }, false, ++id));
            this.pieces_.push(new Bishop({ char: 'c', num: 8 }, false, ++id));
            this.pieces_.push(new Bishop({ char: 'f', num: 8 }, false, ++id));
            this.pieces_.push(new Queen({ char: 'd', num: 8 }, false, ++id));
            this.pieces_.push(new King({ char: 'e', num: 8 }, false, ++id));

            this._setPieces(this.pieces_);
        }

    }

    public choicePiece(id: number): Coordinates[] {
        try {
            const board = this.board_;
            const piece = this._getPiece(id);
            console.log(piece);
            if (piece) {
                this.choicesPiece_ = piece;
                this.legalMove_ = piece.select(board);
                board.flashCells(this.legalMove_);
            }
            else {
                throw new Error('Not Acceptable');
            }
            return this.legalMove_;
        } catch (error) {
            if (error.message === 'Not Acceptable') {
                throw new Error('opponent\'s move')
            } else {
                throw error;
            }
        }
    }

    public move(coordinate: Coordinates): Piece[] {
        
        const board = this.board_;
        const piece = this.choicesPiece_;
        if (JSON.stringify(this.legalMove_)
                .indexOf(JSON.stringify(coordinate)) !== -1) {
            board.select(piece.position.char, piece.position.num).emptyCell();
            
            if (!board.select(coordinate.char, coordinate.num).isEmpty()) {
                board.select(coordinate.char, coordinate.num).emptyCell();
                this.pieces_ = this.pieces_.filter(piece => {
                    return piece.position.char === coordinate.char
                    && piece.position.num === coordinate.num ?
                    false : true;
                });
            }
            
            if (piece.name === 'Pawn' &&
                !board.select(coordinate.char, coordinate.num - 1).isEmpty() &&
                board.select(coordinate.char, coordinate.num - 1).getPiece().isEnPass()) {
                    
                    board.select(coordinate.char, coordinate.num - 1).emptyCell();
                    this.pieces_ = this.pieces_.filter(piece => {
                        return !piece.isEnPass();
                    });
            }
            piece.move(coordinate);
            
            board.insertPiece(piece);
            board.flashOffAllCells();

            this.isQueueWhite_ = !this.isQueueWhite_;
            this.legalMove_ = [];
            this.board_ = board;
            return this.pieces_;

        } else {
            throw new Error('Bad Request');
        }
    
    }

    public getStatus() {
        return this.status;
    }

    public getState(): Board | void {
        return this.board_;
    }

    public pieces(bool?: boolean): Piece[] {
        let pieces: Piece[] = [];
        if (bool) {
            pieces = this.pieces_.filter(item => {
                return item.color === bool;
            });
        } else if (bool !== undefined) {
            pieces = this.pieces_.filter(item => {
                return item.color !== bool;
            });
        } else {
            pieces = this.pieces_.slice();
        }
        return pieces;

    }

    /**
     * PRIVATE
     */

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
        const pieces_Player: Piece[] = this.isQueueWhite_ ?
            this.pieces_.filter(this._isWhite) :
            this.pieces_.filter(this._isBlack);
        const piece: Piece = pieces_Player.filter(item => {
            return item.id == id;
        })[0];
        return piece;
    }
}