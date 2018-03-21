import * as express from 'express';
import * as chessController from '../controllers/chess';

export const router = express.Router();

router.get('/create', chessController.createChess);
// router.get('/room/:id', chessController.getRoom);
// router.get('/status', chessController.getStatus);

// router.get('/start', chessController.startChess);
// router.get('/piece', chessController.getPieces);
// router.get('/piece/:id', chessController.choicePiece);
// router.post('/piece', chessController.movePiece);
// router.post('/cell', chessController.choiceCell);
// router.put('/change', chessController.changePawn);
// router.get('/cancel', chessController.cancelMove);

router.get('/', chessController.createChess);
router.get('/:id', chessController.chess);
