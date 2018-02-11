import { Coordinates } from '../types/coordinates';

export interface IPiece {
    select(): Coordinates[];
    move(coordinates: Coordinates): void;
}