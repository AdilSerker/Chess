import { Coordinates, KeyIndex, CharIndex } from '../types/Coordinates';
import { Piece } from './Piece';
import { Board } from '../Board/Board';

export class Knight extends Piece {

    public constructor(pos: Coordinates, bool: boolean, id: number) {
        super(pos, bool, id);
        this.name_ = 'Knight';
    }

    public select(board: Board): Coordinates[] {
        const char: string = this.pos_.char;
        const num: number = this.pos_.num;
        const index: number = KeyIndex[char];
        const moves: Coordinates[] = [];

        moves.concat(this._checkCell(index + 1, num + 2, board));
        moves.concat(this._checkCell(index + 2, num + 1, board));
        moves.concat(this._checkCell(index + 2, num - 1, board));
        moves.concat(this._checkCell(index + 1, num - 2, board));
        moves.concat(this._checkCell(index - 1, num - 2, board));
        moves.concat(this._checkCell(index - 2, num - 1, board));
        moves.concat(this._checkCell(index - 2, num + 1, board));
        moves.concat(this._checkCell(index - 1, num + 2, board));

        return this.legalMove_ = moves;
    }

    private _checkCell(charIndex: number, number: number, board: Board): Coordinates[] {
        const num: number = number;
        const moves: Coordinates[] = [];
        const index: number = charIndex;

        if (index <= 8 && num <= 8 && index > 0 && num > 0 &&
            (board.select(CharIndex[index], num).isEmpty() ||
            board.select(CharIndex[index], num).getPiece().color !== this.color) ) {
            moves.push({ char: CharIndex[index], num });
        }
        return moves;
    }
}