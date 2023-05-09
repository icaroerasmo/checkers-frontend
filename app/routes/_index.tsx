import { V2_MetaFunction, json } from "@remix-run/node";
import { PieceType, Piece, Direction, TableResponse, PossibleMove } from "./resources/types";
import { userMove, currentState, possibleMoves } from "./resources/services/tableService";
import { useLoaderData } from "@remix-run/react";
import { BLACK_TILE, PLAYER_1_PIECE_COLOR, PLAYER_2_PIECE_COLOR, POSSIBLE_MOVE_COLOR, WHITE_TILE } from "./resources/colors";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

let possibleMovesObj: PossibleMove[] = [{"captures":0,"movesLog":[{"from":[5,3],"captured":null,"to":[4,4],"playerTurn":"BLUE","moveType":"MOVE","direction":"FORWARD_LEFT","description":"Blue in [5,3] moved forward left to [4,4]"}]},{"captures":0,"movesLog":[{"from":[5,3],"captured":null,"to":[4,2],"playerTurn":"BLUE","moveType":"MOVE","direction":"FORWARD_RIGHT","description":"Blue in [5,3] moved forward right to [4,2]"}]}];

const boardBgColor = (line:number, column:number) => {
  return (line + column) % 2 == 0 ? WHITE_TILE : BLACK_TILE;
}

const sessionId: string = '123';

const tableStyle = {
  margin: "0",
  padding: "0",
  border: "0.3em solid black"
}

const lineStyle = (line:number, column:number) => ({
  width: "6em",
  height: "6em",
  margin: "0",
  padding: "0",
  backgroundColor: boardBgColor(line, column),
  border: "0.15em solid black"
})

const pieceWrapperStyle = (line: number, column: number) => {
  
  let found = possibleMovesObj.find(pm => pm.movesLog.find(
    ml => (ml.from[0] === line && ml.from[1] === column) ||
    (ml.to[0] === line && ml.to[1] === column)))

  let color;
  
  if(found) {
    color = POSSIBLE_MOVE_COLOR; 
  }

  return ({
    width: "100%",
    height: "100%",
    backgroundColor: color,
    display: "flex",
    alignItems:"center",
    justifyContent:"center"
  })
}

const pieceStyle = (piece: Piece) => {

  const color = piece.type == PieceType.RED ? PLAYER_1_PIECE_COLOR : PLAYER_2_PIECE_COLOR
  return {
    cursor: "pointer",
    margin: "0",
    borderRadius: "4.5em",
    backgroundColor: color,
    width: "4.5em",
    height: "4.5em"
  }
}

const loadPossibleMoves = async (line: number, column: number) => {
  let data = await possibleMoves({
      sessionId,
      line,
      column
    })

  Object.assign(possibleMovesObj, data);
}

export async function loader() {

  let data = await currentState({
    sessionId: "123"
  })

  let movesCore = data.movesCore;

  if(data.movesCore) {
    movesCore.redPieces = movesCore.redPieces.map(p => ({... p, type: PieceType.RED}))
    movesCore.bluePieces = movesCore.bluePieces.map(p => ({... p, type: PieceType.BLUE}))
  }

  return data
}


const Piece = ({tablePieces, line, column}: {tablePieces: TableResponse, line: number, column: number}) => {

  let pieceFinder = (list: Piece[], line: number, column: number): Piece | undefined => {
    return list.find(piece => piece.line == line && piece.column == column)
  }

  let movesCore = tablePieces.movesCore;

  if(!movesCore) return null;

  let piece =
    pieceFinder(movesCore.redPieces, line, column) || 
    pieceFinder(movesCore.bluePieces, line, column);

  if(!piece) return null;

  return (
    <div onClick={() => {loadPossibleMoves(line, column)}} style={pieceStyle(piece)}/>
  )
}

export default function Index() {
  const data: TableResponse = useLoaderData();
  return (
      <table style={tableStyle}>
        <tbody>
          {Array.from({ length: 8 }, (_value, lineIndex) => (
            <tr className="line">
              {Array.from({ length: 8 }, (_value, columnIndex) => (
                <td key={""+(lineIndex+columnIndex)} style={lineStyle(lineIndex, columnIndex)}>
                  <div style={pieceWrapperStyle(lineIndex, columnIndex)}>
                    <Piece tablePieces={data} line={lineIndex} column={columnIndex} />
                  </div>
                </td>
              ))}
            </tr>
          )).reverse()}
        </tbody>
      </table>
  );
}
