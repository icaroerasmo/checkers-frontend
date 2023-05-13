import { V2_MetaFunction, json } from "@remix-run/node";
import { PieceType, Piece, Direction, TableResponse, PossibleMove, MovesCore } from "./resources/types";
import { userMove, currentState, getPossibleMoves, minimaxMove } from "./resources/services/tableService";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { displayFlex, lineStyle, pieceStyle, pieceWrapperStyle, tableStyle } from "./resources/styles";
import { PLAYER_1_PIECE_COLOR, PLAYER_2_PIECE_COLOR } from "./resources/colors";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

const sessionId = '123'

const pieceFinder = (list: Piece[], line: number, column: number): Piece | undefined => {
  return list.find(piece => piece.line == line && piece.column == column)
}

const isTurn = (piece: Piece | undefined, playerTurn: PieceType) => !!piece && piece.type === playerTurn

const movesCoreTransformer = (movesCore: MovesCore) : MovesCore => ({
  playerTurn: movesCore.playerTurn,
  redPieces: movesCore.redPieces.map(p => ({... p, type: PieceType.RED})),
  bluePieces: movesCore.bluePieces.map(p => ({... p, type: PieceType.BLUE}))
})

export async function loader() {
  
  let data = await currentState({sessionId})

  if(data.movesCore) {
    data.movesCore = movesCoreTransformer(data.movesCore);
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
        (!!lastMove.captured && lastMove.captured[0] === line && lastMove.captured[1] === column)
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

    userMove(userMoveObj).then((response) => {
      response.movesCore = movesCoreTransformer(response.movesCore)
      setData({tableResponse: response, possibleMoves: []})
      if(response.movesCore.redPieces.length && response.movesCore.bluePieces.length) {
        minimaxMove({sessionId}).then(response => {
          response.movesCore = movesCoreTransformer(response.movesCore)
          setData({tableResponse: response, possibleMoves: []})
        })
      }
    })
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
    <div style={displayFlex}>
      <div>
        <div style={displayFlex}>
          <div style={{color: PLAYER_1_PIECE_COLOR}}><h1>Red {data.tableResponse.movesCore.redPieces.length}</h1></div> <div style={{padding: "0 2em 0 2em"}}></div> <div style={{color: PLAYER_2_PIECE_COLOR}}><h1>{data.tableResponse.movesCore.bluePieces.length} Blue</h1></div>
        </div>
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
      </div>
    </div>
  );
}
