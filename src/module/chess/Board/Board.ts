import { Coordinates } from '../types/coordinates';
import { Piece } from '../ChessPiece/Piece';
import { Cell } from './Cell';

export class Board {
    public field: any = {
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
        let id: number = 1;
        let isWhiteCell = true;
        for (const key in this.field) {
            isWhiteCell = !isWhiteCell;
            for (let i = 1; i <= 8; ++i) {
                this.field[key].push(new Cell(id++, isWhiteCell, { char: key, num: i }));
                isWhiteCell = !isWhiteCell;
            }
        }
    }

    public checkCell(cell: Coordinates): number {
        if (this.field[cell.char][cell.num]) {
            return this.field[cell.char][cell.num];
        }
        return null;
    }

    public insertPiece(piece: Piece): void {
        this.field[piece.position.char][piece.position.num].piece = piece;
    }
}