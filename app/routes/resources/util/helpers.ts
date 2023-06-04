import { MovesCore, PieceType } from "../models/types";

export const movesCoreTransformer = (movesCore: MovesCore) : MovesCore => ({
    playerTurn: movesCore.playerTurn,
    redPieces: movesCore.redPieces.map(p => ({... p, type: PieceType.RED})),
    bluePieces: movesCore.bluePieces.map(p => ({... p, type: PieceType.BLUE}))
})