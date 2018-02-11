import { Coordinates } from '../types/coordinates';
import { IPiece } from '../Interface/IPiece';

export abstract class Piece implements IPiece {
    public color: string;
    public name: string;

    protected id_: number;
    protected pos_: Coordinates;
    protected steps_: number;
    protected possibleMove_: Coordinates[];

    public constructor(pos: Coordinates, color: string, id: number) {

        this.id_ = id;
        this.pos_ = pos;
        this.steps_ = 0;
        this.possibleMove_ = [];
        this.color = color;
    }

    public get position(): Coordinates {
        return { ...this.pos_ };
    }

    public get id(): number {
        return this.id_;
    }

    public get legalMove() {
        return this.possibleMove_;
    }

    public set legalMove(legalMoveCoordinates: Coordinates[]) {
        this.possibleMove_ = legalMoveCoordinates.slice();
    }

    public move(pos: Coordinates) {
        if (JSON.stringify(this.possibleMove_)
                .indexOf(JSON.stringify(pos)) !== -1) {
            this.pos_ = pos;
            this.steps_++;
        } else {
            console.error('Invalid move');
        }
    }

    public abstract select(): Coordinates[];
}