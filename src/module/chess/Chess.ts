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
    private isQueueWhite_: boolean = true;
    private legalMoves_: Coordinates[];
    private choicesPiece_: Piece;
    private dump: any;

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
            const piece: Piece = this._getPiece(id);
            
            if (piece) {
                this.choicesPiece_ = piece;
                this.legalMoves_ = piece.select(this.board_);

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
            return this._move(coordinate);
        } catch (error) {
            if (error.message === 'Bad Request') {
                throw new Error('opponent\'s move')
            } else if (error.message === 'move on check') {
                throw error;
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


    private _isLegalMove(coordinate: Coordinates): boolean {
        return JSON.stringify(this.legalMoves_).indexOf(
            JSON.stringify(coordinate)) !== -1;
    }

    private _move(coordinate: Coordinates) {
        if (this._isLegalMove(coordinate)) {
            this.board_.select(this.choicesPiece_.position.char, 
                this.choicesPiece_.position.num).emptyCell();
            
            if (!this.board_.select(coordinate.char, coordinate.num).isEmpty()) {
                this.board_.select(coordinate.char, coordinate.num).emptyCell();
                this.pieces_ = this.pieces_.filter(piece => {
                    return piece.position.char === coordinate.char
                    && piece.position.num === coordinate.num ?
                        false : true;
                });
            }
            
            
            this.choicesPiece_.move(coordinate);
            
            this.board_.insertPiece(this.choicesPiece_);
            
            this.board_.flashOffAllCells();
            
            this.isQueueWhite_ = !this.isQueueWhite_;
            
            this.legalMoves_ = [];
            
            return this.pieces_;
            
        } else {
            throw new Error('Bad Request');
        }
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
        const pieces_Player: Piece[] = this.isQueueWhite_ ?
        this.pieces_.filter(this._isWhite) :
        this.pieces_.filter(this._isBlack);
        const piece: Piece = pieces_Player.filter(item => {
            return item.id == id;
        })[0];
        return piece;
    }
}
// if (this.choicesPiece_.name === 'Pawn' &&
//     !this.board_.select(coordinate.char, coordinate.num - 1).isEmpty() &&
//     this.board_.select(coordinate.char, coordinate.num - 1).getPiece().isEnPass()) {
//         this.board_.select(coordinate.char, coordinate.num - 1).emptyCell();
//         this.pieces_ = this.pieces_.filter(piece => {
//             return !piece.isEnPass();
//         });
// }

// private _moveByCheck(coordinate: Coordinates) {
            //     const board = this.board_;
            //     const piece = this.choicesPiece_;
            //     if (piece.name === 'King') {
            //         console.log('ход короля');
            //         const piecesOpponent = this.pieces_.filter(item => {
            //             return item.color !== piece.color;
            //         });
            //         console.log(piecesOpponent.length);
            //         let cellByte: Coordinates[] = [];
        
            //         piecesOpponent.forEach(opponentPiece => {
            //             console.log('check pawn')
            //             if (opponentPiece.name === 'Pawn') {
            //                 let pieceMove = (opponentPiece.select(board))[0];
            //                 console.log(opponentPiece);
            //                 try {
            //                 if (KeyIndex[pieceMove.char] + 1 <= 8 && 
            //                     CharIndex[KeyIndex[pieceMove.char] + 1]) {
                                
            //                     cellByte.push({
            //                         char: CharIndex[KeyIndex[pieceMove.char] + 1],
            //                         num: pieceMove.num
            //                     });
            //                 }
        
            //                 if (CharIndex[KeyIndex[pieceMove.char] - 1]) {
                                
            //                     cellByte.push({
            //                         char: CharIndex[KeyIndex[pieceMove.char] - 1],
            //                         num: pieceMove.num
            //                     });
            //                 }
            //                 } catch(error) {
            //                     console.error(error);
            //                 }
            //             } else {
            //                 let pieceMoves = opponentPiece.select(board);
            //                 pieceMoves.forEach(move => {
            //                     cellByte.push(move);
            //                 });
            //             }
            //         });
            //         const moves = this.legalMove_.filter(item => {
            //             return JSON.stringify(cellByte).indexOf(JSON.stringify(item)) === -1;
            //         });
            //         console.log(moves);
            //         this.legalMove_ = moves;
            //     }
            // }