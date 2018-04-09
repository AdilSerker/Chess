import { Chess } from '../module/chess/Chess';
import { Coordinates } from '../module/chess/types/Coordinates'

export type Connect = { 
    [sid: string]: SocketIO.Socket 
}

export type ChessRoom = {
    [id: number]: Connect[]
}

export type ChessGames = {
    [id: number]: Chess
}

export type PieceResponse = {
    name: string,
    id: number,
    position: Coordinates,
    color: boolean
}