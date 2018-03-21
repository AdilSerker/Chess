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


// export const createChess = (req: Request, res: Response) =>{

//     var id = Math.round((Math.random() * 1000000));

//     // Redirect to the random room
//     res.redirect('room/'+id);
// }

// export const getRoom = (req: Request, res: Response) =>{
//     // Redirect to the random room
//     res.render("home", {
//         title: "Room " + req.params.id
//     });
// }

// export const getStatus = (req: Request, res: Response) => {
//     res.json(chess.getStatus());
// };

// export const startChess = (req: Request, res: Response) => {
//     chess.init();
//     res.send('Initial data, chess status = true');
// };

// export const choicePiece = (req: Request, res: Response) => {
//     try {
//         res.json(chess.choicePiece(req.params.id));
//     } catch (error) {
//         res.status(406);
//         console.error(error.message);
//         res.send(error.message);
//     }

// };

// export const choiceCell = (req: Request, res: Response) => {
//     try {
//         res.json(chess.choiceCell({ ...req.body }));
//     } catch (error) {
//         res.status(406);
//         console.error(error.message);
//         res.send(error.message);
//     }
// };

// export const movePiece = (req: Request, res: Response) => {
//     try {
//         res.json(chess.move({ ...req.body }));
//     } catch (error) {
//         res.status(400);
//         console.error(error.message);
//         res.send(error.message);
//     }
// };

// export const cancelMove = (req: Request, res: Response) => {
//     try {
//         res.json(chess.cancelMove());
//     } catch (error) {
//         res.status(400);
//         console.error(error.message);
//         res.send(error.message);
//     }
// };

// export const changePawn = (req: Request, res: Response) => {
//     try {
//         res.json(chess.changePawn(req.body.name));
//     } catch (error) {
//         res.status(400);
//         console.error(error.message);
//         res.send(error.message);
//     }
// };

// export const getPieces = (req: Request, res: Response) => {
//     res.json(chess.pieces());
// };


// /**
//  * WEB SOCKETS Handlers
//  */
// export const move = (coord: Coordinates) => {
//     try {
//         chess.move(coord);
//     } catch (error) {
//         console.error(error);
//     }
// }

// export const pieces = (bool?: boolean) => {
//     try {
//         return chess.pieces(bool);
//     } catch (error) {
//         return error.message;
//     }
// }