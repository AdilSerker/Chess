import { Coordinates, CharIndex, KeyIndex } from '../types/Coordinates';
import { Piece } from './Piece';
import { Board } from '../Board/Board';

export class Pawn extends Piece {
    

    public constructor(pos: Coordinates, bool: boolean, id: number) {
        super(pos, bool, id);
        this.name_ = 'Pawn';
    }

    public select(board: Board): Coordinates[] {
        const char: string = this.pos_.char;
        const n: number = this.pos_.num;
        const moves: Coordinates[] = [];
        const index: number = KeyIndex[char];

        if (!this.steps_) {
            if (this.color) {
                if (board.select(char, n + 1).isEmpty() && board.select(char, n + 2).isEmpty()) {
                    moves.push({ char, num: n + 1 }, { char: char, num: n + 2 });
                }
            } else {
                if (board.select(char, n - 1).isEmpty() && board.select(char, n - 2).isEmpty()) {
                    moves.push({ char: char, num: n - 1 }, { char: char, num: n - 2 });
                }
            }
        } else {
            if (this.color) {
                if (board.select(char, n + 1).isEmpty()) {
                    moves.push({ char, num: n + 1 });
                }
            } else {
                if (board.select(char, n - 1).isEmpty()) {
                    moves.push({ char, num: n - 1 });
                }
            }
        }

        if (this.color) {
            
            if (CharIndex[index + 1] && n + 1 <= 8 &&
                !board.select(CharIndex[index + 1], n + 1).isEmpty() &&
                board.select(CharIndex[index + 1], n + 1).getPiece().color !== this.color) {
                moves.push({ char: CharIndex[index + 1], num: n + 1 });
            }

            if (CharIndex[index - 1] && n + 1 <= 8 &&
                !board.select(CharIndex[index - 1], n + 1).isEmpty() &&
                board.select(CharIndex[index - 1], n + 1).getPiece().color !== this.color) {
                moves.push({ char: CharIndex[index - 1], num: n + 1 });
            }
            if (CharIndex[index - 1] && n === 5 &&
                !board.select(CharIndex[index - 1], n).isEmpty() &&
                board.select(CharIndex[index - 1], n).getPiece().enPassant &&
                board.select(CharIndex[index - 1], n).getPiece().isFirstStep()) {
                    console.log('pawn left');
                    moves.push({ char: CharIndex[index - 1], num: n + 1 });
            }

            if (CharIndex[index + 1] && n === 5 &&
                !board.select(CharIndex[index + 1], n).isEmpty() &&
                board.select(CharIndex[index + 1], n).getPiece().enPassant &&
                board.select(CharIndex[index + 1], n).getPiece().isFirstStep()) {
                    console.log('pawn right');
                    moves.push({ char: CharIndex[index + 1], num: n + 1 });
            }

        } else {

            if (CharIndex[index + 1] && n - 1 > 0 &&
                !board.select(CharIndex[index + 1], n - 1).isEmpty() &&
                board.select(CharIndex[index + 1], n - 1).getPiece().color !== this.color) {
                moves.push({ char: CharIndex[index + 1], num: n - 1 });
            }

            if (CharIndex[index - 1] && n - 1 > 0 &&
                !board.select(CharIndex[index - 1], n - 1).isEmpty() &&
                board.select(CharIndex[index - 1], n - 1).getPiece().color !== this.color) {
                moves.push({ char: CharIndex[index - 1], num: n - 1 });
            }

            if (CharIndex[index - 1] && n === 4 &&
                !board.select(CharIndex[index - 1], n).isEmpty() &&
                board.select(CharIndex[index - 1], n).getPiece().enPassant &&
                board.select(CharIndex[index - 1], n).getPiece().isFirstStep()) {
                    moves.push({ char: CharIndex[index - 1], num: n - 1 });
            }

            if (CharIndex[index + 1] && n === 4 &&
                !board.select(CharIndex[index + 1], n).isEmpty() &&
                board.select(CharIndex[index + 1], n).getPiece().enPassant &&
                board.select(CharIndex[index + 1], n).getPiece().isFirstStep()) {
                    moves.push({ char: CharIndex[index + 1], num: n - 1 });
            }

        }

        return this.legalMove_ = moves;
    }
}