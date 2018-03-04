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
        const num: number = this.pos_.num;
        const moves: Coordinates[] = [];
        const index: number = KeyIndex[char];

        const step = this.color ? num + 1 : num - 1;
        const doubleStep = this.color ? num + 2 : num - 2;
        const n = this.color ? 5 : 4;

        if (this.isNotMove() && board.select(char, doubleStep).isEmpty()) {
            moves.push({ char: char, num: doubleStep });
        }

        if (board.select(char, step).isEmpty()) {
            moves.push({ char, num: step });
        }

        if (CharIndex[index + 1] && step <= 8 && 
            !board.select(CharIndex[index + 1], step).isEmpty() &&
            board.select(CharIndex[index + 1], step).getPiece().color !== this.color) {
                moves.push({ char: CharIndex[index + 1], num: step });
        }

        if (CharIndex[index - 1] && step <= 8 &&
            !board.select(CharIndex[index - 1], step).isEmpty() &&
            board.select(CharIndex[index - 1], step).getPiece().color !== this.color) {
                moves.push({ char: CharIndex[index - 1], num: step });
        }

        if (CharIndex[index - 1] && num === n &&
            !board.select(CharIndex[index - 1], num).isEmpty() &&
            board.select(CharIndex[index - 1], num).getPiece().enPassant &&
            board.select(CharIndex[index - 1], num).getPiece().isFirstStep()) {
                console.log('pawn left');
                moves.push({ char: CharIndex[index - 1], num: step });
        }
        if (CharIndex[index + 1] && num === n &&
            !board.select(CharIndex[index + 1], num).isEmpty() &&
            board.select(CharIndex[index + 1], num).getPiece().enPassant &&
            board.select(CharIndex[index + 1], num).getPiece().isFirstStep()) {
                console.log('pawn right');
                moves.push({ char: CharIndex[index + 1], num: step });
        }

        return this.legalMove_ = moves;
    }
}