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

    private counter: number = 0;

    public constructor() {
        let id: number = 1,
            booleanColor = true;

        for (const key in this.field_) {
            booleanColor = !booleanColor;
            for (let i = 1; i <= 8; ++i) {
                this.field_[key].push(new Cell(id++, booleanColor, { char: key, num: i }));
                booleanColor = !booleanColor;
            }
        }
    }

    public insertPiece(piece: Piece): void {
        this.field_[piece.position.char][piece.position.num].insertPiece(piece);
    }

    public select(char: string, num: number): Cell {
        return this.field_[char][num];
    }

    public flashCells(coordinates: Coordinates[]): void {
        coordinates.forEach(item => {
            this.field_[item.char][item.num].flash();
        });
    }

    public flashOffAllCells(): void {
        for (const key in this.field_) {
            this.field_[key].forEach((cell: Cell) => {
                if (cell) {
                    cell.flashOff();
                }
            });
        }
    }

    public getPieces(bool: boolean): Piece[] {
        let pieces: Piece[] = [];
        
        try {
            for (const key in this.field_) {
                for (let i = 1; i <= 8; ++i) {
                    if (this.field_[key][i] && !this.field_[key][i].isEmpty()) {
                        if (this.field_[key][i].getPiece().color === bool) {
                            const piece = this.field_[key][i].getPiece();
                            
                            pieces.push(piece);
                        }
                    }
                }
            }
            return pieces;
        } catch (error) {
            throw error;
        }
    }
}
