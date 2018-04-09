import { Request, Response } from "express";
import { Chess } from '../module/chess/Chess';
import { Coordinates, KeyIndex, CharIndex } from '../module/chess/types/Coordinates';

export const createChess = (req: Request, res: Response) => {
    const id = Math.round((Math.random() * 10000000000000000));

    res.redirect(`/chess/${id}`);
};

export const chess = (req: Request, res: Response) => {
    res.render("chess", {
        title: "Chess"
    });
};