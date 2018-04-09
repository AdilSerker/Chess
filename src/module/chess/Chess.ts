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
    public id: number;

    private pieces_: Piece[];
    private board_: Board;
    private status: boolean = false;
    private queue: boolean = true;
    private legalMoves_: Coordinates[];
    private choicesPiece_: Piece;
    private changePawn_: boolean = false;

    private pieceId: number;

    private dumpBoard: Board;
    private dumpPiece: Piece[];
    private dumpQueue: boolean;

    /**
     * PUBLIC
     */

    public constructor(id?: number) {
        this.id = id;
        this.board_ = new Board();
        this.choicesPiece_ = null;
        this.pieces_ = [];
        this.pieceId = 0;
    }

    public init(): void {

        if (!this.status) {
            this.status = true;
            this.pieces_ = [];
            this._initWhitePieces();
            this._initBlackPieces();
            this.queue = true;
            this.legalMoves_ = [];
            this.changePawn_ = false;
            this._setPieces(this.pieces_);
        }
    }

    public get isChangePawn() {
        return this.changePawn_;
    }

    public choiceCell(pos: Coordinates): Coordinates[] | void {
        if (!this.changePawn_) {
            const piece: Piece = this._getPieceByPos(pos.char, pos.num);

            if (piece) {
                this.choicesPiece_ = piece;
                this.legalMoves_ = piece.select(this.board_);

                this.board_.flashCells(this.legalMoves_);

                return this.legalMoves_;
            } else {
                this.legalMoves_ = [];
            }
        } else {
            throw new Error('Change Pawn');
        }
    }

    public choicePiece(id: number): Coordinates[] {
        if (!this.changePawn_) {
            const piece: Piece = this._getPiece(id);

            if (piece) {
                this.choicesPiece_ = piece;
                this.legalMoves_ = piece.select(this.board_);

                this.board_.flashCells(this.legalMoves_);

                return this.legalMoves_;
            } else {
                throw new Error('NOT ACCEPTABLE');
            }
        } else {
            throw new Error('Change Pawn');
        }
    }

    public move(coordinate: Coordinates): Piece[] {
        if (this.choicesPiece_) {
            this._makeDump();

            this._move(coordinate);

            if (this._isCheck()) {

                this._revert();
                throw new Error('move on check');
            } else {
                this.queue = !this.queue;

                this.choicesPiece_ = null;
                return this.pieces_;
            }
        } else {
            console.log('CHOICE PIECE');
        }
    }

    public getStatus() {
        return this.status;
    }

    public setStatus(bool: boolean): void {
        this.status = bool;
    }

    public getState(): Board | void {
        return this.board_;
    }

    public cancelMove(): Piece[] {
        this._revert();
        return this.pieces_;
    }

    public pieces(bool?: boolean) {
        return this._getPieces(bool).map((piece: Piece) => {
            return {
                name: piece.name,
                id: piece.id,
                position: { ...piece.position },
                color: piece.color
            };
        });
    }

    public changePawn(piece: string): Piece[] {
        if (this.changePawn_) {
            const pieces = this._getPieces(this.queue);
            const row = this.queue ? 8 : 1;

            const pawn = pieces.filter(item => {
                return item.name === 'Pawn' &&
                    item.position.num === row;
            })[0];

            this._insertPiece(piece, pawn);
            this.changePawn_ = false;
            this.queue = !this.queue;
        }
        return this.pieces_;
    }

    public getLegalMove(): Coordinates[] {
        return this.legalMoves_;
    }

    public getQueue(): boolean {
        return this.queue;
    }
    /**
     * PRIVATE
     */

    private _delPiece(coordinate: Coordinates): void {
        this.pieces_ = this.pieces_.filter(piece => {
            return piece.position.char === coordinate.char
                && piece.position.num === coordinate.num ?
                false : true;
        });
    }

    private _insertPiece(piece: string, pawn: Piece): void {
        switch (piece) {
            case 'Queen':
                const queen = new Queen(pawn.position, pawn.color, pawn.id);
                this._delPiece(pawn.position);
                this.pieces_.push(queen);
                this.board_.insertPiece(queen);
                break;
            case 'Rook':
                const rook = new Rook(pawn.position, pawn.color, pawn.id);
                this._delPiece(pawn.position);
                this.pieces_.push(rook);
                this.board_.insertPiece(rook);
                break;
            case 'Bishop':
                const bishop = new Bishop(pawn.position, pawn.color, pawn.id);
                this._delPiece(pawn.position);
                this.pieces_.push(bishop);
                this.board_.insertPiece(bishop);
                break;
            case 'Knight':
                const knight = new Knight(pawn.position, pawn.color, pawn.id);
                this._delPiece(pawn.position);
                this.pieces_.push(knight);
                this.board_.insertPiece(knight);
                break;
            default:
                break;
        }
    }

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
        const char = this.choicesPiece_.position.char,
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
                this._pawnMove(coordinate);
            } else {
                this._unEnPass();
            }

            this.choicesPiece_.move(coordinate);

            const row = this.queue ? 8 : 1;
            if (this.choicesPiece_.position.num === row && this.choicesPiece_.name === 'Pawn') {

                this.queue = !this.queue;

                this.changePawn_ = true;
            }

            this.board_.insertPiece(this.choicesPiece_);

            this.board_.flashOffAllCells();

            this.legalMoves_ = [];

        } else {
            this.choicesPiece_ = null;
            throw new Error('Bad Request');
        }
    }

    private _pawnMove(coordinate: Coordinates): void {
        const char = this.choicesPiece_.position.char,
            num = this.choicesPiece_.position.num,
            index = KeyIndex[char],
            board = this.board_;

        const step = this.queue ? coordinate.num - num : num - coordinate.num;
        const cell = this.queue ? coordinate.num - 1 : coordinate.num + 1;

        if (this.choicesPiece_.isNotMove() && step === 2) {
            this.choicesPiece_.enPassant = true;
        } else if (!board.select(coordinate.char, cell).isEmpty() &&
            board.select(coordinate.char, cell).getPiece().color !== this.choicesPiece_.color &&
            board.select(coordinate.char, cell).getPiece().enPassant) {
            const id = board.select(coordinate.char, cell).getPiece().id;
            board.select(coordinate.char, cell).emptyCell();
            this.pieces_ = this.pieces_.filter(item => {
                return item.id !== id;
            });
            this._unEnPass();
        } else {
            this._unEnPass();
        }
    }

    private _unEnPass(): void {
        this.pieces_.forEach(item => {
            item.enPassant = false;
        });
    }

    private _castling(coordinate: Coordinates): void {
        const char = this.choicesPiece_.position.char,
            num = this.choicesPiece_.position.num,
            index = KeyIndex[char],
            board = this.board_;

        const prev = KeyIndex[coordinate.char] - index === 2 ? 'h' : 'a';
        const aftr = KeyIndex[coordinate.char] - index === 2 ? 'f' : 'd';

        const rook = this._getPieceByPos(prev, num);
        board.select(prev, num).emptyCell();

        const array = rook.select(board);

        board.select(prev, num).emptyCell();

        rook.move({ char: aftr, num });
        board.insertPiece(rook);
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


        opponentPieces.forEach((item: Piece) => {


            cellAttack = cellAttack.concat(item.select(this.board_));
        });

        const king = this.pieces_.filter((item: Piece) => {
            return item.color === this.queue && item.name === 'King';
        })[0];

        return JSON.stringify(cellAttack)
            .includes(JSON.stringify(king.position));
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

    private _getPieceByPos(char: string, num: number): Piece {
        const pieces_Player: Piece[] = this.queue ?
            this.pieces_.filter(this._isWhite) :
            this.pieces_.filter(this._isBlack);
        const piece: Piece = pieces_Player.filter(item => {
            return item.position.char === char && item.position.num === num;
        })[0];
        return piece;
    }
}