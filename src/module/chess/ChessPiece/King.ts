import { Coordinates, rowChar } from '../types/coordinates';
import { Piece } from './Piece';

export class King extends Piece {

    public constructor(pos: Coordinates, color: string, id: number) {
        super(pos, color, id);
        this.name = 'King';
    }

    public select(): Coordinates[] {
        const idx: number = rowChar.indexOf(this.pos_.char);
        this.possibleMove_ = [];
        if (idx + 1 <= 8) {
            this.possibleMove_.push({
                char: rowChar[idx + 1],
                num: this.pos_.num
            });
        }

        if (idx + 1 <= 8 && this.pos_.num + 1 <= 8) {
            this.possibleMove_.push({
                char: rowChar[idx + 1],
                num: this.pos_.num + 1
            });
        }

        if (this.pos_.num + 1 <= 8) {
            this.possibleMove_.push({
                char: rowChar[idx],
                num: this.pos_.num + 1
            });
        }

        if (idx - 1 > 0 && this.pos_.num + 1 <= 8) {
            this.possibleMove_.push({
                char: rowChar[idx - 1],
                num: this.pos_.num + 1
            });
        }

        if (idx - 1 > 0) {
            this.possibleMove_.push({
                char: rowChar[idx - 1],
                num: this.pos_.num
            });
        }

        if (idx - 1 > 0 && this.pos_.num - 1 > 0) {
            this.possibleMove_.push({
                char: rowChar[idx - 1],
                num: this.pos_.num - 1
            });
        }

        if (this.pos_.num - 1 > 0) {
            this.possibleMove_.push({
                char: rowChar[idx],
                num: this.pos_.num - 1
            });
        }

        if (idx + 1 <= 8 && this.pos_.num - 1 > 0) {
            this.possibleMove_.push({
                char: rowChar[idx + 1],
                num: this.pos_.num - 1
            });
        }

        return this.possibleMove_;
    }
}