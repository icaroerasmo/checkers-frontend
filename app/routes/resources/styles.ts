import { WHITE_TILE_COLOR, PIECE_CAPTURE_COLOR, PIECE_FROM_COLOR, PLAYER_1_PIECE_COLOR, PLAYER_2_PIECE_COLOR, POSSIBLE_MOVE_COLOR, BLACK_TILE_COLOR } from "./colors";
import { Piece, PieceType, PossibleMove } from "./types";

const boardBg = (line: number, column: number) => {
    const isBlackTile = (line + column) % 2 == 0
    const color = isBlackTile ? BLACK_TILE_COLOR : WHITE_TILE_COLOR;
    const backgroundImg = isBlackTile ? " url('/img/geometric_texture2.png') repeat scroll center" : "";
    return color /*+ backgroundImg*/;
}

export const displayFlex = {display:"flex", alignItems: "center", justifyContent: "center"}

  
export const tableStyle = {
    margin: "0",
    padding: "0",
    border: "0.3em solid black"
}
  
export const lineStyle = (line:number, column:number) => ({
    width: "6em",
    height: "6em",
    margin: "0",
    padding: "0",
    background: boardBg(line, column),
    border: "0.15em solid black"
})
  
export const pieceWrapperStyle = (possibleMoves: PossibleMove[], line: number, column: number) => {

    const piecesComparator = (pieceCoordinates: number[]) => {
        return !!pieceCoordinates &&
        pieceCoordinates[0] === line &&
        pieceCoordinates[1] === column
    }

    const moves = possibleMoves.
        map(pm => pm.movesLog).
        reduce((x, y) => x.concat(y), []);

    let moveFound = moves.find(ml => 
        piecesComparator(ml.from) ||
        piecesComparator(ml.to) ||
        piecesComparator(ml.captured))

    let color, cursor;

    if(moveFound) {
        cursor = "pointer"
        if(piecesComparator(moveFound.from)) {
            color = PIECE_FROM_COLOR;
        } else if(piecesComparator(moveFound.to)) {
            color = POSSIBLE_MOVE_COLOR; 
        } else {
            color = PIECE_CAPTURE_COLOR;
        }
    }

    return ({
        cursor,
        width: "100%",
        height: "100%",
        backgroundColor: color,
        display: "flex",
        alignItems:"center",
        justifyContent:"center"
    })
}
  
export const pieceStyle = (piece: Piece, isTurn: boolean) => {

    const color = piece.type == PieceType.RED ?
        PLAYER_1_PIECE_COLOR : PLAYER_2_PIECE_COLOR

    return {
        display: "flex",
        alignItems:"center",
        justifyContent:"center",
        cursor: isTurn ? "pointer" : undefined,
        margin: "0",
        borderRadius: "4.5em",
        border: "0.1em solid #a0a0a0",
        backgroundColor: color,
        width: "4.5em",
        height: "4.5em"
    }
}