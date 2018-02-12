import { Coordinates, KeyIndex, CharIndex } from '../types/Coordinates';
import { Piece } from './Piece';
import { Board } from '../Board/Board';

export class Rook extends Piece {

    public constructor(pos: Coordinates, bool: boolean, id: number) {
        super(pos, bool, id);
        this.name_ = 'Rook';
    }

    public select(board: Board): Coordinates[] {
        const char: string = this.pos_.char;
        const num: number = this.pos_.num;
        const moves: Coordinates[] = [];

        const index: number = KeyIndex[char];

        for (let n = num + 1; n <= 8; ++n) {
            if (!board.select(char, n).isEmpty() &&
                    board.select(char, n).getPiece().color === this.color) {
                break;
            } else if (!board.select(char, n).isEmpty() &&
                board.select(char, n).getPiece().color !== this.color) {
                moves.push({ char, num: n });
                break;
            } else {
                moves.push({ char, num: n });
            }
        }

        for (let c = index + 1; c <= 8; c++) {
            if (!board.select(CharIndex[c], num).isEmpty() &&
                    board.select(CharIndex[c], num).getPiece().color === this.color) {
                break;
            } else if (!board.select(CharIndex[c], num).isEmpty() &&
                board.select(CharIndex[c], num).getPiece().color !== this.color) {
                moves.push({ char: CharIndex[c], num });
                break;
            } else {
                moves.push({ char: CharIndex[c], num });
            }
        }

        for (let n = num - 1; n > 0; n--) {
            if (!board.select(char, n).isEmpty() &&
                    board.select(char, n).getPiece().color === this.color) {
                break;
            } else if (!board.select(char, n).isEmpty() &&
                board.select(char, n).getPiece().color !== this.color) {
                moves.push({ char, num: n });
                break;
            } else {
                moves.push({ char, num: n });
            }
        }

        for (let c = index - 1; c > 0; c--) {
            if (!board.select(CharIndex[c], num).isEmpty() &&
                    board.select(CharIndex[c], num).getPiece().color === this.color) {
                break;
            } else if (!board.select(CharIndex[c], num).isEmpty() &&
                board.select(CharIndex[c], num).getPiece().color !== this.color) {
                moves.push({ char: CharIndex[c], num });
                break;
            } else {
                moves.push({ char: CharIndex[c], num });
            }
        }

        return this.legalMove_ = moves;
    }
}