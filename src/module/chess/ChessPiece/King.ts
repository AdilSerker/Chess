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
        let moves: Coordinates[] = [];
        
        const row = this.color_ ? 1 : 8;
        
        
        
        if (num + 1 <= 8 && 
            (board.select(char, num + 1).isEmpty() ||
            board.select(char, num + 1).getPiece().color !== this.color)
        ) {
                moves.push({ char, num: num + 1 });
        }
        
        if (num + 1 <= 8 && index + 1 <= 8 &&
            (board.select(CharIndex[index + 1], num + 1).isEmpty() ||
            board.select(CharIndex[index + 1], num + 1).getPiece().color !== this.color) 
        ) {
                moves.push({ char: CharIndex[index + 1], num: num + 1 });
        }
        //right
        if (index + 1 <= 8 && 
            (board.select(CharIndex[index + 1], num).isEmpty() ||
            board.select(CharIndex[index + 1], num).getPiece().color !== this.color)
        ) {
                moves.push({ char: CharIndex[index + 1], num });
        }
        
        if (num - 1 > 0 && index + 1 <= 8 &&
            (board.select(CharIndex[index + 1], num - 1).isEmpty() ||
            board.select(CharIndex[index + 1], num - 1).getPiece().color !== this.color)
        ) {
                moves.push({ char: CharIndex[index + 1], num: num - 1 });
        }
        //left
        if (index - 1 > 0 && 
            (board.select(CharIndex[index - 1], num).isEmpty() ||
            board.select(CharIndex[index - 1], num).getPiece().color !== this.color)
        ) {
                moves.push({ char: CharIndex[index - 1], num });
        }
        
        if (num - 1 > 0 && index - 1 > 0 &&
            (board.select(CharIndex[index - 1], num - 1).isEmpty() ||
            board.select(CharIndex[index - 1], num - 1).getPiece().color !== this.color) 
        ) {
                moves.push({ char: CharIndex[index - 1], num: num - 1 });
        }
        
        if (num - 1 > 0 && 
            (board.select(char, num - 1).isEmpty() ||
            board.select(char, num - 1).getPiece().color !== this.color)
        ) {
                moves.push({ char, num: num - 1 });
        }
        
        if (num + 1 <= 8 && index - 1 <= 8 &&
            (board.select(CharIndex[index - 1], num + 1).isEmpty() ||
            board.select(CharIndex[index - 1], num + 1).getPiece().color !== this.color)
        ) {
                moves.push({ char: CharIndex[index - 1], num: num + 1 });
        }

        if (!this.steps_ && !board.select('a', row).isEmpty() &&
            board.select('a', row).getPiece().isNotMove() && 
            board.select('b', row).isEmpty() &&
            board.select('c', row).isEmpty() && 
            board.select('d', row).isEmpty() &&
            !this._isSquareAttacked({ char: 'e', num: row }, board) &&
            !this._isSquareAttacked({ char: 'd', num: row }, board) &&
            !this._isSquareAttacked({ char: 'c', num: row }, board) 
        ) {
                moves.push({ char: 'c', num: row });
        }

        if (!this.steps_ && !board.select('h', row).isEmpty() &&
            board.select('h', row).getPiece().isNotMove() && 
            board.select('g', row).isEmpty() && 
            board.select('f', row).isEmpty() &&
            !this._isSquareAttacked({ char: 'e', num: row }, board) &&
            !this._isSquareAttacked({ char: 'f', num: row }, board) &&
            !this._isSquareAttacked({ char: 'g', num: row }, board)
        ) {
                moves.push({ char: 'g', num: row });
        }

        return this.legalMove_ = moves;
    }
    
    private _isSquareAttacked(square: Coordinates, board: Board): boolean {
        const enemys: Piece[] = board.getPieces(!this.color);
        for (let i = 0; i < enemys.length; ++i) {
            if (enemys[i].name !== 'King') {
                if (JSON.stringify(enemys[i].select(board)).includes(JSON.stringify(square))) {
                    return true;
                }
            }
        }
        return false;
    }
}