import { Coordinates } from '../types/Coordinates';
import { Piece } from '../ChessPiece/Piece';

export interface ICell {
    insertPiece(piece: Piece): void;
    emptyCell(): void;
    getPiece(): Piece | null;
    flash(): void;
    flashOff(): void;
    isEmpty(): boolean;
}