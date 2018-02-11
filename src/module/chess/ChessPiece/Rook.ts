import { Coordinates, rowChar } from '../types/coordinates';
import { Piece } from './Piece';

export class Rook extends Piece {

    public constructor(pos: Coordinates, color: string, id: number) {
        super(pos, color, id);
        this.name = 'Rook';
    }

    public select(): Coordinates[] {
        const idx: number = rowChar.indexOf(this.pos_.char);
        this.possibleMove_ = [];
        for (let i = idx + 1; i <= 8; ++i) {
            this.possibleMove_.push({
                char: rowChar[i],
                num: this.pos_.num
            });
        }

        for (let j = this.pos_.num - 1; j > 0; --j) {
            this.possibleMove_.push({
                char: rowChar[idx],
                num: j
            });
        }

        for (let j = this.pos_.num + 1; j <= 8; ++j) {
            this.possibleMove_.push({
                char: rowChar[idx],
                num: j
            });
        }

        for (let i = idx - 1; i > 0; --i) {
            this.possibleMove_.push({
                char: rowChar[i],
                num: this.pos_.num
            });
        }

        return this.possibleMove_;
    }
}