import { V2_MetaFunction, json } from "@remix-run/node";
import { PieceType, Piece, Direction, TableResponse, PossibleMove } from "./resources/types";
import { userMove, currentState, possibleMoves } from "./resources/services/tableService";
import { useLoaderData } from "@remix-run/react";
import { BLACK_TILE_COLOR, PIECE_FROM_COLOR, PLAYER_1_PIECE_COLOR, PLAYER_2_PIECE_COLOR, POSSIBLE_MOVE_COLOR, WHITE_TILE_COLOR } from "./resources/colors";
import { useEffect, useState } from "react";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

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

export default function Index() {

  let tableState: {tableResponse: TableResponse, possibleMoves: PossibleMove[]} = {
    tableResponse: useLoaderData(),
    possibleMoves: []
  }

  const [data, setData] = useState(tableState);


  const boardBgColor = (line:number, column:number) => {
    return (line + column) % 2 == 0 ? WHITE_TILE_COLOR : BLACK_TILE_COLOR;
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
  
    let piecesComparator = (pieceCoordinates: number[]) => {
      return !!pieceCoordinates &&
        pieceCoordinates[0] === line &&
        pieceCoordinates[1] === column
    }
  
    let moves = data.possibleMoves.
      map(pm => pm.movesLog).
      reduce((x, y) => x.concat(y), []);
  
    let moveFound = moves.find(ml => 
      piecesComparator(ml.from) ||
      piecesComparator(ml.to) ||
      piecesComparator(ml.captured))
  
    let color;
    
    if(moveFound) {
      if(piecesComparator(moveFound.from)) {
        color = PIECE_FROM_COLOR;
      } else if(piecesComparator(moveFound.to)) {
        color = POSSIBLE_MOVE_COLOR; 
      } else {
        color = 'blue'
      }
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
      border: "0.1em solid #a0a0a0",
      backgroundColor: color,
      width: "4.5em",
      height: "4.5em"
    }
  }
  
  const loadPossibleMoves = (line: number, column: number) => {
    possibleMoves({
        sessionId,
        line,
        column
      }).then(res => setData({tableResponse: data.tableResponse, possibleMoves: res}))
  }

  const Piece = ({line, column}: {line: number, column: number}) => {

    let pieceFinder = (list: Piece[], line: number, column: number): Piece | undefined => {
      return list.find(piece => piece.line == line && piece.column == column)
    }
  
    let movesCore = data.tableResponse.movesCore;
  
    if(!movesCore) return null;
  
    let piece =
      pieceFinder(movesCore.redPieces, line, column) || 
      pieceFinder(movesCore.bluePieces, line, column);
  
    if(!piece) return null;
  
    return (
      <div onClick={() => {loadPossibleMoves(line, column)}} style={pieceStyle(piece)}/>
    )
  }

  return (
      <table style={tableStyle}>
        <tbody>
          {Array.from({ length: 8 }, (_value, lineIndex) => (
            <tr className="line">
              {Array.from({ length: 8 }, (_value, columnIndex) => (
                <td key={""+(lineIndex+columnIndex)} style={lineStyle(lineIndex, columnIndex)}>
                  <div style={pieceWrapperStyle(lineIndex, columnIndex)}>
                    <Piece line={lineIndex} column={columnIndex} />
                  </div>
                </td>
              ))}
            </tr>
          )).reverse()}
        </tbody>
      </table>
  );
}
