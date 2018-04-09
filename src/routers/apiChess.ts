import * as express from 'express';
import * as chessController from '../controllers/chess';

export const router = express.Router();

router.get('/', chessController.createChess);
router.get('/:id', chessController.chess);
