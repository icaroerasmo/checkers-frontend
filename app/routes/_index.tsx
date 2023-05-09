import { V2_MetaFunction, json } from "@remix-run/node";
import { PieceType, Piece, Direction, TableResponse, PossibleMove, MovesCore } from "./resources/types";
import { userMove, currentState, possibleMoves } from "./resources/services/tableService";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { lineStyle, pieceStyle, pieceWrapperStyle, tableStyle } from "./resources/styles";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

const sessionId = '123'

const pieceFinder = (list: Piece[], line: number, column: number): Piece | undefined => {
  return list.find(piece => piece.line == line && piece.column == column)
}

const isTurn = (piece: Piece | undefined, playerTurn: PieceType) => !!piece && piece.type === playerTurn 

export async function loader() {
  
  let data = await currentState({sessionId})

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
  
  const loadPossibleMoves = (line: number, column: number) => {

    const tableResponse: TableResponse = data.tableResponse;
    const movesCore: MovesCore = tableResponse.movesCore;

    const piece: Piece | undefined =
      pieceFinder(movesCore.bluePieces, line, column) ||
      pieceFinder(movesCore.redPieces, line, column)

    if(!isTurn(piece, movesCore.playerTurn)) {
      return;
    }
    
    possibleMoves({sessionId, line, column}).
      then(res => setData(
        {
          tableResponse: data.tableResponse,
          possibleMoves: res
        }))
  }

  const Piece = ({line, column}: {line: number, column: number}) => {

    const tableResponse: TableResponse = data.tableResponse;
    const movesCore: MovesCore = tableResponse.movesCore;
  
    if(!movesCore) return null;
  
    let piece =
      pieceFinder(movesCore.redPieces, line, column) || 
      pieceFinder(movesCore.bluePieces, line, column);
  
    if(!piece) return null;
  
    return (
      <div onClick={() => {loadPossibleMoves(line, column)}} style={pieceStyle(piece, isTurn(piece, movesCore.playerTurn))}/>
    )
  }

  return (
      <table style={tableStyle} onClick = {() => setData({tableResponse: data.tableResponse, possibleMoves: []})}>
        <tbody>
          {Array.from({ length: 8 }, (_value, lineIndex) => (
            <tr className="line">
              {Array.from({ length: 8 }, (_value, columnIndex) => (
                <td key={""+(lineIndex+columnIndex)} style={lineStyle(lineIndex, columnIndex)}>
                  <div style={pieceWrapperStyle(data.possibleMoves, lineIndex, columnIndex)}>
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
