import { Coordinates } from '../types/coordinates';
import { Piece } from '../ChessPiece/Piece';

export interface ICell {
    insertPiece(piece: Piece): void;
    emptyCell(): void;
    getPiece(): Piece;
}