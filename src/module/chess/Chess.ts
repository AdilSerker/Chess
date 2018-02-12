import { Board } from './Board/Board';
import { Piece } from './ChessPiece/Piece';
import { Bishop } from './ChessPiece/Bishop';
import { King } from './ChessPiece/King';
import { Knight } from './ChessPiece/Knight';
import { Pawn } from './ChessPiece/Pawn';
import { Queen } from './ChessPiece/Queen';
import { Rook } from './ChessPiece/Rook';
import { Coordinates, KeyIndex, CharIndex } from './types/Coordinates';
import { PieceView } from './types/RenderField';

export class Chess {
    public pieces: Piece[];

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
            //     this.pieces.push(new Pawn({ char: rowChar[i], num: 2 }, true, ++id));
            // }
            this.pieces.push(new Rook({ char: 'a', num: 1 }, true, ++id));
            this.pieces.push(new Knight({ char: 'b', num: 1 }, true, ++id));
            this.pieces.push(new Bishop({ char: 'c', num: 1 }, true, ++id));
            this.pieces.push(new Queen({ char: 'd', num: 1 }, true, ++id));
            this.pieces.push(new King({ char: 'e', num: 1 }, true, ++id));
            this.pieces.push(new Bishop({ char: 'f', num: 1 }, true, ++id));
            this.pieces.push(new Knight({ char: 'g', num: 1 }, true, ++id));
            this.pieces.push(new Rook({ char: 'h', num: 1 }, true, ++id));

            /*
            *  init Black Piece
            */
            // for (let i = 1; i <= 8; ++i) {
            //     this.pieces.push(new Pawn({ char: rowChar[i], num: 7 }, false, ++id));
            // }
            this.pieces.push(new Rook({ char: 'a', num: 8 }, false, ++id));
            this.pieces.push(new Knight({ char: 'b', num: 8 }, false, ++id));
            this.pieces.push(new Bishop({ char: 'c', num: 8 }, false, ++id));
            this.pieces.push(new Queen({ char: 'd', num: 8 }, false, ++id));
            this.pieces.push(new King({ char: 'e', num: 8 }, false, ++id));
            this.pieces.push(new Bishop({ char: 'f', num: 8 }, false, ++id));
            this.pieces.push(new Knight({ char: 'g', num: 8 }, false, ++id));
            this.pieces.push(new Rook({ char: 'h', num: 8 }, false, ++id));

            this._setPieces(this.pieces);
        }

    }

    public choicePiece(id: number): void {
        const board = this.board;
        const piecesPlayer: Piece[] = this.isQueueWhite_ ?
            this.pieces.filter(this._isWhite) :
            this.pieces.filter(this._isBlack);
        const piece: Piece = piecesPlayer.filter(item => {
            return item.id == id;
        })[0];
        console.log(piece);
        if (piece) {
            this.choicesPiece_ = piece;
            this.legalMove_ = piece.select(board);
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
            board.select(piece.position.char, piece.position.num).emptyCell();
            piece.move(coordinate);
            board.insertPiece(piece);
            this.isQueueWhite_ = !this.isQueueWhite_;
        } else {
            throw new Error('Bad Request');
        }
    }

    public get legalMove(): Coordinates[] {
        return this.legalMove_;
    }

    public get state(): string | void {
        return JSON.stringify(this.board_);
    }

    public get board() {
        return this.board_;
    }

    public get controlPiece() {
        return this.choicesPiece_;
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

    private _setPieces(pieces: Piece[]): void {
        pieces.forEach(piece => {
            this.board_.insertPiece(piece);
        });
    }
}