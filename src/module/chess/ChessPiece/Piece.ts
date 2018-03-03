import { Coordinates } from '../types/Coordinates';
import { IPiece } from '../Interface/IPiece';
import { Board } from '../Board/Board';

export abstract class Piece implements IPiece {

    protected color_: boolean;
    protected name_: string;
    protected id_: number;
    protected pos_: Coordinates;
    protected steps_: number;
    protected legalMove_: Coordinates[];

    public enPassant: boolean;

    public constructor(pos: Coordinates, bool: boolean, id: number) {

        this.id_ = id;
        this.pos_ = pos;
        this.steps_ = 0;
        this.legalMove_ = [];
        this.color_ = bool;
    }

    public get id(): number {
        return this.id_;
    }

    public isNotMove(): boolean {
        return this.steps_ === 0;
    }

    public get position(): Coordinates {
        return { ...this.pos_ };
    }

    public get name(): string {
        return this.name_;
    }

    public get color(): boolean {
        return this.color_;
    }

    public isFirstStep(): boolean {
        return this.steps_ === 1;
    }

    public move(pos: Coordinates) {
        if (JSON.stringify(this.legalMove_)
                .indexOf(JSON.stringify(pos)) !== -1) {

            this.pos_ = pos;
            this.steps_++;
        } else {
            console.error('Invalid move');
        }
    }

    public abstract select(board: Board, stepCount?: number): Coordinates[];
}