import { Coordinates, KeyIndex, CharIndex } from '../types/Coordinates';
import { Piece } from './Piece';
import { Board } from '../Board/Board';

export class Bishop extends Piece {

    public constructor(pos: Coordinates, bool: boolean, id: number) {
        super(pos, bool, id);
        this.name_ = 'Bishop';
    }

    public select(board: Board): Coordinates[] {
        const char: string = this.pos_.char;
        const num: number = this.pos_.num;
        const index: number = KeyIndex[char];
        const moves: Coordinates[] = [];

        for (let c = index + 1, n = num + 1; c <= 8 && n <= 8; ++c, ++n) {
            if (board.select(CharIndex[c], n).isEmpty()) {
                moves.push({ char: CharIndex[c], num: n });
            } else if (board.select(CharIndex[c], n).getPiece().color !== this.color) {
                moves.push({ char: CharIndex[c], num: n });
                break;
            } else {
                break;
            }
        }

        for (let c = index + 1, n = num - 1; c <= 8 && n > 0; ++c, --n) {
            if (board.select(CharIndex[c], n).isEmpty()) {
                moves.push({ char: CharIndex[c], num: n });
            } else if (board.select(CharIndex[c], n).getPiece().color !== this.color) {
                moves.push({ char: CharIndex[c], num: n });
                break;
            } else {
                break;
            }
        }

        for (let c = index - 1, n = num - 1; c > 0 && n > 0; --c, --n) {
            if (board.select(CharIndex[c], n).isEmpty()) {
                moves.push({ char: CharIndex[c], num: n });
            } else if (board.select(CharIndex[c], n).getPiece().color !== this.color) {
                moves.push({ char: CharIndex[c], num: n });
                break;
            } else {
                break;
            }
        }

        for (let c = index - 1, n = num + 1; c > 0 && n <= 8; --c, ++n) {
            if (board.select(CharIndex[c], n).isEmpty()) {
                moves.push({ char: CharIndex[c], num: n });
            } else if (board.select(CharIndex[c], n).getPiece().color !== this.color) {
                moves.push({ char: CharIndex[c], num: n });
                break;
            } else {
                break;
            }
        }

        return this.legalMove_ = moves;
    }
}