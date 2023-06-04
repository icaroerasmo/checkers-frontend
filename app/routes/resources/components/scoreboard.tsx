import { Grid } from "@mui/material";
import { PLAYER_1_PIECE_COLOR, PLAYER_2_PIECE_COLOR } from "../constants/colors";

export default function Scoreboard({state}: {state: any}) {
    const [data] = state
    return (
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <div style={{color: PLAYER_1_PIECE_COLOR}}>
            <h1>Red {data.tableResponse.movesCore.redPieces.length}</h1>
          </div>
          <div style={{padding: "0 2em 0 2em"}}></div>
          <div style={{color: PLAYER_2_PIECE_COLOR}}>
            <h1>{data.tableResponse.movesCore.bluePieces.length} Blue</h1>
          </div>
        </Grid>
    )
}