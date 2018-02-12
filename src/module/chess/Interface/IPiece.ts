import { Coordinates } from '../types/Coordinates';
import { Board } from '../Board/Board';

export interface IPiece {
    select(board: Board): Coordinates[];
    move(coordinates: Coordinates): void;
    id: number;
    name: string;
    color: boolean;
    position: Coordinates;
}