import { V2_MetaFunction } from "@remix-run/node";
import { currentState } from "./resources/services/tableService";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { TableResponse, PossibleMove, PieceType } from "./resources/models/types";
import Table from "./resources/components/table";
import { movesCoreTransformer } from "./resources/util/helpers";
import Scoreboard from "./resources/components/scoreboard";
import { Box, Grid } from "@mui/material";
import Settings from "./resources/components/settings";
import {v4 as uuid} from 'uuid';

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

const sessionId = uuid()

export async function loader() {
  
  let data = await currentState({sessionId})

  if(data.movesCore) {
    data.movesCore = movesCoreTransformer(data.movesCore);
  }

  return data
}

export default function Index() {

  let tableState = () : {sessionId: string, player: PieceType, tableResponse: TableResponse, possibleMoves: PossibleMove[]} => ({
    sessionId,
    player: PieceType.RED,
    tableResponse: useLoaderData(),
    possibleMoves: []
  })

  const state = useState(tableState);

  return (
    <Grid container direction="row" alignItems="center" justifyContent="center" style={{height:"100%"}}>
      <Grid container direction="row" alignItems="center" justifyContent="center" sx={{minWidth: "300px", maxWidth: "1300px"}}>
        <Grid container xs={12}>
          <Scoreboard state={state}/>
        </Grid>
        <Grid container lg={7} md={7} xs={12} direction="row" alignItems="center" justifyContent="center">
          <Table state={state} />
        </Grid>
        <Box sx={{ p: 2 }}/>
        <Grid container lg={3} md={3} xs={12} direction="row" alignItems="center" justifyContent="flex-end">
          <Settings state={state}/>
        </Grid>
      </Grid>
    </Grid>
  );
}
