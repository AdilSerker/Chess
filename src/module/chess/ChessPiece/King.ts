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

        if (num + 1 <= 8 && 
            (board.select(char, num + 1).isEmpty() ||
            board.select(char, num + 1).getPiece().color !== this.color)) {
                moves.push({ char, num: num + 1 });
        }
        
        if (num + 1 <= 8 && index + 1 <= 8 &&
            (board.select(CharIndex[index + 1], num + 1).isEmpty() ||
            board.select(CharIndex[index + 1], num + 1).getPiece().color !== this.color)) {
                moves.push({ char: CharIndex[index + 1], num: num + 1 });
        }
        
        if (index + 1 <= 8 && 
            (board.select(CharIndex[index + 1], num).isEmpty() ||
            board.select(CharIndex[index + 1], num).getPiece().color !== this.color)) {
                moves.push({ char: CharIndex[index + 1], num });
        }
        
        if (num - 1 > 0 && index + 1 <= 8 &&
            (board.select(CharIndex[index + 1], num - 1).isEmpty() ||
            board.select(CharIndex[index + 1], num - 1).getPiece().color !== this.color)) {
                moves.push({ char: CharIndex[index + 1], num: num - 1 });
        }
        
        if (index - 1 > 0 && 
            (board.select(CharIndex[index - 1], num).isEmpty() ||
            board.select(CharIndex[index - 1], num).getPiece().color !== this.color)) {
                moves.push({ char: CharIndex[index - 1], num });
        }
        
        if (num - 1 > 0 && index - 1 > 0 &&
            (board.select(CharIndex[index - 1], num - 1).isEmpty() ||
            board.select(CharIndex[index - 1], num - 1).getPiece().color !== this.color)) {
                moves.push({ char: CharIndex[index - 1], num: num - 1 });
        }
        
        if (num - 1 > 0 && 
            (board.select(char, num - 1).isEmpty() ||
            board.select(char, num - 1).getPiece().color !== this.color)) {
                moves.push({ char, num: num - 1 });
        }
        
        if (num + 1 <= 8 && index - 1 <= 8 &&
            (board.select(CharIndex[index - 1], num + 1).isEmpty() ||
            board.select(CharIndex[index - 1], num + 1).getPiece().color !== this.color)) {
                moves.push({ char: CharIndex[index - 1], num: num + 1 });
        }

        if (this.color_) {
            if (!this.steps_ && !board.select('a', 1).isEmpty() &&
                board.select('a', 1).getPiece().isNotMove() && board.select('b', 1).isEmpty() &&
                board.select('c', 1).isEmpty() && board.select('d', 1).isEmpty()) {
                    moves.push({ char: 'c', num: 1 });
            }
            if (!this.steps_ && !board.select('h', 1).isEmpty() &&
                board.select('h', 1).getPiece().isNotMove() && 
                board.select('g', 1).isEmpty() && board.select('f', 1).isEmpty()) {
                    moves.push({ char: 'g', num: 1 });
            }
        } else {
            if (!this.steps_ && !board.select('h', 8).isEmpty() &&
                board.select('h', 8).getPiece().isNotMove() && 
                board.select('g', 8).isEmpty() && board.select('f', 8).isEmpty()) {
                    moves.push({ char: 'g', num: 8 });
            }
            if (!this.steps_ && !board.select('a', 8).isEmpty() &&
                board.select('a', 8).getPiece().isNotMove() && board.select('b', 8).isEmpty() &&
                board.select('c', 8).isEmpty() && board.select('d', 8).isEmpty()) {
                    moves.push({ char: 'c', num: 8 });
            }
        }
        
        return this.legalMove_ = moves;
    }
}