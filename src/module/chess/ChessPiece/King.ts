import { Coordinates, KeyIndex, CharIndex } from '../types/Coordinates';
import { Piece } from './Piece';
import { Board } from '../Board/Board';

export class King extends Piece {

    public constructor(pos: Coordinates, bool: boolean, id: number) {
        super(pos, bool, id);
        this.name_ = 'King';
    }

    public select(board: Board): Coordinates[] {
        const char: string = this.pos_.char;
        const num: number = this.pos_.num;
        const index: number = KeyIndex[char];
        const moves: Coordinates[] = [];

        if (num + 1 <= 8 && (board.select(char, num + 1).isEmpty() ||
            board.select(char, num + 1).getPiece().color !== this.color)) {
                moves.push({ char, num: num + 1 });
        }

        if (num + 1 <= 8 && index + 1 <= 8 &&
            (board.select(CharIndex[index + 1], num + 1).isEmpty() ||
            board.select(CharIndex[index + 1], num + 1).getPiece().color !== this.color)) {
                moves.push({ char: CharIndex[index + 1], num: num + 1 });
        }

        if (index + 1 <= 8 && (board.select(CharIndex[index + 1], num).isEmpty() ||
            board.select(CharIndex[index + 1], num).getPiece().color !== this.color)) {
                moves.push({ char: CharIndex[index + 1], num });
        }

        if (num - 1 > 0 && index + 1 <= 8 &&
            (board.select(CharIndex[index + 1], num - 1).isEmpty() ||
            board.select(CharIndex[index + 1], num - 1).getPiece().color !== this.color)) {
                moves.push({ char: CharIndex[index + 1], num: num - 1 });
        }

        if (index - 1 > 0 && (board.select(CharIndex[index - 1], num).isEmpty() ||
            board.select(CharIndex[index - 1], num).getPiece().color !== this.color)) {
                moves.push({ char: CharIndex[index - 1], num });
        }

        if (num - 1 > 0 && index - 1 > 0 &&
            (board.select(CharIndex[index - 1], num - 1).isEmpty() ||
            board.select(CharIndex[index - 1], num - 1).getPiece().color !== this.color)) {
                moves.push({ char: CharIndex[index - 1], num: num - 1 });
        }

        if (num - 1 > 0 && (board.select(char, num + 1).isEmpty() ||
            board.select(char, num + 1).getPiece().color !== this.color)) {
                moves.push({ char, num: num - 1 });
        }

        if (num + 1 <= 8 && index - 1 <= 8 &&
            (board.select(CharIndex[index - 1], num + 1).isEmpty() ||
            board.select(CharIndex[index - 1], num + 1).getPiece().color !== this.color)) {
                moves.push({ char: CharIndex[index - 1], num: num + 1 });
        }

        return this.legalMove_ = moves;
    }
}