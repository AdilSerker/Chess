import { Coordinates } from '../types/coordinates';
import { Piece } from './Piece';

export class Pawn extends Piece {

    public constructor(pos: Coordinates, color: string, id: number) {
        super(pos, color, id);
        this.name = 'Pawn';
    }

    public select(): Coordinates[] {
        if (!this.steps_) {
            this.possibleMove_ = [{
                char: this.pos_.char,
                num: this.color === 'white' ? this.pos_.num + 1 : this.pos_.num - 1
            }, {
                char: this.pos_.char,
                num: this.color === 'white' ? this.pos_.num + 2 : this.pos_.num - 2
            }];
        } else {
            this.possibleMove_ = [{
                char: this.pos_.char,
                num: this.color === 'white' ? this.pos_.num + 1 : this.pos_.num - 1
            }];
        }
        return this.possibleMove_;
    }
}