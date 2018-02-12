import { Coordinates } from '../types/Coordinates';
import { Piece } from '../ChessPiece/Piece';
import { ICell } from '../Interface/ICell';

export class Cell implements ICell {
    private id_: number;
    private color_: string;
    private flash_: boolean;
    private coordinate_: Coordinates;
    private piece_: Piece | null;

    public constructor(id: number, bool: boolean, coordinate: Coordinates) {
        this.id_ = id;
        this.color_ = bool ? 'white' : 'black';
        this.coordinate_ = coordinate;
        this.piece_ = null;
    }

    public insertPiece(piece: Piece): void {
        this.piece_ = piece;
    }

    public emptyCell(): void {
        this.piece_ = null;
    }

    public getPiece(): Piece | null {
        return this.piece_;
    }

    public flash(): void {
        this.flash_ = true;
    }

    public isEmpty(): boolean {
        return this.piece_ === null;
    }

    public flashOff(): void {
        this.flash_ = false;
    }

}