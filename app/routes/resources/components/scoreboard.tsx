import { Grid, ThemeProvider, Typography, createTheme } from "@mui/material";
import { PLAYER_1_PIECE_COLOR, PLAYER_2_PIECE_COLOR } from "../constants/colors";

export default function Scoreboard({state}: {state: any}) {
    const [data] = state

    const theme = createTheme();

    theme.typography.h1 = {
      [theme.breakpoints.up('xs')]: {
        fontSize: '2.5rem',
      },
      [theme.breakpoints.up('sm')]: {
        fontSize: '3rem',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '4rem',
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: '4.5rem',
      }
    };

    return (
      <ThemeProvider theme={theme}>
        <Grid container item xs={12} direction="row" alignItems="center" justifyContent="center" sx={{textAlign: "center"}}>
          <Grid item xs={6}>
            <Typography sx={{m: 2, color: PLAYER_1_PIECE_COLOR}} variant="h1" component="h2">
              Red {data.tableResponse.movesCore.redPieces.length}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{m: 2, color: PLAYER_2_PIECE_COLOR}} variant="h1" component="h2">
              {data.tableResponse.movesCore.bluePieces.length} Blue
            </Typography>
          </Grid>
        </Grid>
      </ThemeProvider>
    )
}