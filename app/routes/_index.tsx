import { V2_MetaFunction, json } from "@remix-run/node";
import { PieceType, Piece, Direction, TableResponse } from "./resources/types";
import { useEffect } from "react";
import userMove from "./resources/services/tableService";
import { useLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

const boardBgColor = (line:number, column:number) => {
  return (line + column) % 2 == 0 ? "black" : "white";
}

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

const pieceWrapperStyle = {
  display: "flex",
  alignItems:"center",
  justifyContent:"center"
}

const pieceStyle = (piece: Piece) => {
  const color = piece.type == PieceType.RED ? "red" : "blue"
  return {
    margin: "0",
    borderRadius: "4.5em",
    backgroundColor: color,
    width: "4.5em",
    height: "4.5em"
  }
}

const pieceRender = (tablePieces: TableResponse, line: number, column: number) => {

  let pieceFinder = (list: Piece[], line: number, column: number): Piece | undefined => {
    return list.find(piece => piece.line == line && piece.column == column)
  }

  let movesCore = tablePieces.movesCore;

  if(!movesCore) return '';

  let piece =
    pieceFinder(movesCore.redPieces, line, column) || 
    pieceFinder(movesCore.bluePieces, line, column);

  if(!piece) return '';

  return (
    <div style={pieceWrapperStyle}>
      <div style={pieceStyle(piece)}></div>
    </div>
  )
}

export async function loader() {

  let data = await userMove({
    sessionId: "123",
    line: 5,
    column: 1,
    directions: [Direction.FORWARD_LEFT]
  })

  let movesCore = data.movesCore;

  if(data.movesCore) {
    movesCore.redPieces = movesCore.redPieces.map(p => ({... p, type: PieceType.RED}))
    movesCore.bluePieces = movesCore.bluePieces.map(p => ({... p, type: PieceType.BLUE}))
  }

  return data
}

export default function Index() {
  const data: TableResponse = useLoaderData();
  console.log(data)
  return (
      <table style={tableStyle}>
        <tbody>
          {Array.from({ length: 8 }, (_value, lineIndex) => (
            <tr className="line">
              {Array.from({ length: 8 }, (_value, columnIndex) => (
                <td key={""+(lineIndex+columnIndex)} style={lineStyle(lineIndex, columnIndex)}>
                  {pieceRender(data, lineIndex, columnIndex)}
                </td>
              ))}
            </tr>
          )).reverse()}
        </tbody>
      </table>
  );
}
