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
router.post('/chess/piece/move', chessController.movePiece);
router.put('/chess/changePawn', chessController.changePawn);

