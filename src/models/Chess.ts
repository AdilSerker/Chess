import * as mongoose from "mongoose";
import { Board } from '../module/chess/Board/Board';
import { Piece } from '../module/chess/ChessPiece/Piece';

const chessSchema = new mongoose.Schema({
    board: Object,
    pieces: Array,
    queue: Boolean
});

const ChessModel = mongoose.model('Chess', chessSchema);

export default ChessModel;