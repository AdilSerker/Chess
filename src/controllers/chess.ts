import { Request, Response } from "express";
import { Chess } from '../module/chess/Chess';

const chess: Chess = new Chess();

export const getChess = (req: Request, res: Response) => {
    res.json(chess.getState());
};

export const getStatus = (req: Request, res: Response) => {
    res.json(chess.getStatus());
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
        console.error(error.message);
        res.send(error.message);
    }

};

export const choiceCell = (req: Request, res: Response) => {
    try {
        res.json(chess.choiceCell({ ...req.body }));
    } catch (error) {
        res.status(406);
        console.error(error.message);
        res.send(error.message);
    }
};

export const movePiece = (req: Request, res: Response) => {
    try {
        res.json(chess.move({ ...req.body }));
    } catch (error) {
        res.status(400);
        console.error(error.message);
        res.send(error.message);
    }
};

export const changePawn = (req: Request, res: Response) => {
    try {
        res.json(chess.changePawn(req.body.name));
    } catch (error) {
        res.status(400);
        console.error(error.message);
        res.send(error.message);
    }
};

export const getPieces = (req: Request, res: Response) => {
    res.json(chess.pieces());
};