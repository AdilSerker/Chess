import { Request, Response } from "express";
import { Chess } from '../module/chess/Chess';

const chess: Chess = new Chess();

export const getChess = (req: Request, res: Response) => {
    res.json(chess.getState());
};

export const startChess = (req: Request, res: Response) => {
    chess.init();
    res.send('Initial data, chess status = true');
};


export const choicePiece = (req: Request, res: Response) => {
    try {
        res.json(chess.choicePiece(req.params.id));
    } catch (error) {
        res.status(406);
        res.send(error.message);
    }

};

export const movePiece = (req: Request, res: Response) => {
    try {
        chess.move({ ...req.body });
        res.json(chess.getState());
    } catch (error) {
        res.status(400);
        res.send(error.message);
    }
};

export const getPieces = (req: Request, res: Response) => {
    res.json(chess.pieces);
};