import { Coordinates } from '../types/coordinates';
import { Piece } from '../ChessPiece/Piece';
import { ICell } from '../Interface/ICell';

export class Cell implements ICell {
    private id_: number;
    private color_: string;
    private flash_: boolean;
    private coordinate: Coordinates;
    private piece: Piece | null;

    public constructor(id: number, bool: boolean, coordinate: Coordinates) {
        this.id_ = id;
        this.color_ = bool ? 'white' : 'black';
        this.coordinate = coordinate;
        this.piece = null;
    }

    public insertPiece(piece: Piece): void {
        this.piece = piece;
    }

    public emptyCell(): void {
        this.piece = null;
    }

    public getPiece(): Piece {
        return this.piece;
    }

}