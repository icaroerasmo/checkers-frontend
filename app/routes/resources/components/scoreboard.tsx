import { Grid, Typography } from "@mui/material";
import { PLAYER_1_PIECE_COLOR, PLAYER_2_PIECE_COLOR } from "../constants/colors";

export default function Scoreboard({state}: {state: any}) {
    const [data] = state
    return (
      <Grid container direction="row" alignItems="center" justifyContent="center" sx={{maxWidth: "700px"}}>
        <Grid item xs={6}>
          <Typography sx={{color: PLAYER_1_PIECE_COLOR}} variant="h1" component="h2">
            Red {data.tableResponse.movesCore.redPieces.length}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{color: PLAYER_2_PIECE_COLOR}} variant="h1" component="h2">
          {data.tableResponse.movesCore.bluePieces.length} Blue
          </Typography>
        </Grid>
      </Grid>
    )
}