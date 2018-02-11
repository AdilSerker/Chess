import { Coordinates, rowChar } from '../types/coordinates';
import { Piece } from './Piece';

export class Bishop extends Piece {

    public constructor(pos: Coordinates, color: string, id: number) {
        super(pos, color, id);
        this.name = 'Bishop';
    }

    public select(): Coordinates[] {
        const idx: number = rowChar.indexOf(this.pos_.char);
        this.possibleMove_ = [];
        for (let i = idx + 1, j = this.pos_.num + 1; i <= 8 && j <= 8; ++i, ++j) {
            this.possibleMove_.push({
                char: rowChar[i],
                num: j
            });
        }

        for (let i = idx + 1, j = this.pos_.num - 1; i <= 8 && j > 0; ++i, --j) {
            this.possibleMove_.push({
                char: rowChar[i],
                num: j
            });
        }

        for (let i = idx - 1, j = this.pos_.num + 1; i > 0 && j <= 8; --i, ++j) {
            this.possibleMove_.push({
                char: rowChar[i],
                num: j
            });
        }

        for (let i = idx - 1, j = this.pos_.num - 1; i > 0 && j > 0; --i, --j) {
            this.possibleMove_.push({
                char: rowChar[i],
                num: j
            });
        }

        return this.possibleMove_;
    }
}