import { V2_MetaFunction, json } from "@remix-run/node";
import { PieceType, Piece, Direction, TableResponse, PossibleMove, MovesCore } from "./resources/types";
import { userMove, currentState, getPossibleMoves } from "./resources/services/tableService";
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

  const {tableResponse, possibleMoves} = data;
  const movesCore: MovesCore = tableResponse.movesCore;
  const {bluePieces, redPieces, playerTurn}: MovesCore = movesCore;
  
  const loadPossibleMoves = (line: number, column: number) => {

    const piece: Piece | undefined =
      pieceFinder(bluePieces, line, column) ||
      pieceFinder(redPieces, line, column)

    if(!isTurn(piece, playerTurn)) {
      return;
    }
    
    getPossibleMoves({sessionId, line, column}).
      then(possibleMoves =>
        setData({tableResponse, possibleMoves}))
  }

  const doUserMove = (line: number, column: number) => {
    let foundMove = possibleMoves.find(pm => {
      let moves = pm.movesLog;
      let lastMove = moves[moves.length-1];
      return (lastMove.to[0] === line && lastMove.to[1] === column) ||
        lastMove.captured[0] === line && lastMove.captured[1] === column
    })

    if(!foundMove) {
      setData({tableResponse: data.tableResponse, possibleMoves: []})
      return;
    }

    let firstMove = foundMove.movesLog[0];

    let userMoveObj = {
      sessionId,
      line: firstMove.from[0],
      column: firstMove.from[1],
      directions:foundMove.movesLog.map(ml => ml.direction)
    }

    userMove(userMoveObj).then((response) => setData({tableResponse: response, possibleMoves: []}))
  }

  const Piece = ({line, column}: {line: number, column: number}) => {
  
    let piece =
      pieceFinder(redPieces, line, column) || 
      pieceFinder(bluePieces, line, column);
  
    if(!piece) return null;
  
    return (
      <div onClick={() => {loadPossibleMoves(line, column)}} style={pieceStyle(piece, isTurn(piece, playerTurn))}/>
    )
  }

  return (
      <table style={tableStyle} onClick = {() => setData({tableResponse: data.tableResponse, possibleMoves: []})}>
        <tbody>
          {Array.from({ length: 8 }, (_value, lineIndex) => (
            <tr className="line">
              {Array.from({ length: 8 }, (_value, columnIndex) => (
                <td key={""+(lineIndex+columnIndex)} style={lineStyle(lineIndex, columnIndex)}>
                  <div onClick = {() => doUserMove(lineIndex, columnIndex)} style={pieceWrapperStyle(data.possibleMoves, lineIndex, columnIndex)}>
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
