import * as express from 'express';
import * as apiController from '../controllers/api';
import * as chessController from '../controllers/chess';

export const router = express.Router();

router.get('/', apiController.getApi);
router.get('/chess', chessController.getChess);
router.get('/chess/status', chessController.getStatus);
router.get('/chess/start', chessController.startChess);
router.get('/chess/piece', chessController.getPieces);
router.get('/chess/piece/:id', chessController.choicePiece);
router.post('/chess/piece', chessController.movePiece);
router.post('/chess/cell', chessController.choiceCell);
router.put('/chess/change', chessController.changePawn);
router.get('/chess/cancel', chessController.cancelMove);

