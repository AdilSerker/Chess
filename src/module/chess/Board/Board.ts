import { Coordinates } from '../types/Coordinates';
import { Piece } from '../ChessPiece/Piece';
import { Cell } from './Cell';

export class Board {
    private field_: any = {
        a: [ null ],
        b: [ null ],
        c: [ null ],
        d: [ null ],
        e: [ null ],
        f: [ null ],
        g: [ null ],
        h: [ null ]
    };

    public constructor() {
        let id: number = 1,
            isWhiteCell = true;

        for (const key in this.field_) {
            isWhiteCell = !isWhiteCell;
            for (let i = 1; i <= 8; ++i) {
                this.field_[key].push(new Cell(id++, isWhiteCell, { char: key, num: i }));
                isWhiteCell = !isWhiteCell;
            }
        }
    }

    public insertPiece(piece: Piece): void {
        this.field_[piece.position.char][piece.position.num].insertPiece(piece);
    }

    public select(char: string, num: number): Cell {
        return this.field_[char][num];
    }
}