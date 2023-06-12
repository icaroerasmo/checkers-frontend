import { crownStyle, lineStyle, pieceStyle, pieceWrapperStyle, tableStyle } from "../util/styles";
import { getPossibleMoves, minimaxMove, userMove, } from "../services/tableService";
import { MovesCore, Piece, PieceType, PossibleMove, MovesLog } from "../models/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import { movesCoreTransformer } from "../util/helpers";
import { Grid } from "@mui/material";

export default function Table ({sessionId, state}: {sessionId: string, state: any}) {

    const [data, setData] = state

    const pieceFinder = (list: Piece[], line: number, column: number): Piece | undefined => {
      return list.find(piece => piece.line == line && piece.column == column)
    }
    
    const isTurn = (piece: Piece | undefined, playerTurn: PieceType) => !!piece && piece.type === playerTurn

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
        let foundMove = possibleMoves.find((pm: PossibleMove) => {
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
        directions:foundMove.movesLog.map((ml: MovesLog) => ml.direction)
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

        let icon = null;
    
        if(!piece) return null;
    
        if(piece.checker) {
            icon = (
                <Grid container item style={crownStyle} direction="row" 
                        alignItems="center" justifyContent="center">
                    <FontAwesomeIcon icon={faCrown}/>
                </Grid>
            )
        }

        return (
          <div onClick={() => {loadPossibleMoves(line, column)}} style={pieceStyle(piece, isTurn(piece, playerTurn))}>
              {icon}
          </div>
        )
    }

    const tableRenderer = (lineIndex: number, columnIndex: number) => (
        <Grid container item xs={1.5} direction="row" alignItems="center"
                justifyContent="center" sx={lineStyle(lineIndex, columnIndex)}>
            <Grid container onClick = {() => doUserMove(lineIndex, columnIndex)}
                    sx={pieceWrapperStyle(data.possibleMoves, lineIndex, columnIndex)}>
                <Grid container item direction="row" alignItems="center" justifyContent="center">
                    <Piece line={lineIndex} column={columnIndex} />
                </Grid>
            </Grid>
        </Grid>
    )

    const cleanPossibleMoves = {tableResponse: data.tableResponse, possibleMoves: []};

    return (
        <Grid container direction="row" alignItems="center" justifyContent="center"
            sx={tableStyle} onClick = {() => setData(cleanPossibleMoves)}>
            {Array.from({ length: 8 }, (_value, lineIndex) => (
                Array.from({ length: 8 }, (_value, columnIndex) => (
                    tableRenderer(lineIndex, columnIndex)
                ))
            )).reverse()}
        </Grid>
    )
}
