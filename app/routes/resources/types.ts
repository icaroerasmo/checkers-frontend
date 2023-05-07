export enum PieceType {
    RED = "RED",
    BLUE = "BLUE"
}

export interface Piece {
    line: number
    column: number
    isChecker: boolean
    type: PieceType
}

export enum Direction {
    FORWARD_LEFT = "FORWARD_LEFT",
    FORWARD_RIGHT = "FORWARD_RIGHT",
    BACKWARD_LEFT = "BACKWARD_LEFT",
    BACKWARD_RIGHT = "BACKWARD_RIGHT"
}

export interface GameSession {
    sessionId: string
}

export class UserMove implements GameSession {

    sessionId: string
    line: number
    column: number
    directions: Direction[]

    constructor(sessionId: string, line: number, column: number, directions: Direction[]) {
        this.sessionId = sessionId
        this.line = line
        this.column = column
        this.directions = directions
    }
}

export type MovesCore = {
    playerTurn: PieceType,
    redPieces: Piece[],
    bluePieces: Piece[]
}

export type TableResponse = {
    movesCore: MovesCore
    movesLog: string[]
    captures: number
}