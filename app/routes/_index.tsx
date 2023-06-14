import { V2_MetaFunction } from "@remix-run/node";
import { currentState } from "./resources/services/tableService";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { TableResponse, PossibleMove } from "./resources/models/types";
import Table from "./resources/components/table";
import { movesCoreTransformer } from "./resources/util/helpers";
import Scoreboard from "./resources/components/scoreboard";
import { Box, Grid } from "@mui/material";
import Settings from "./resources/components/settings";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

const sessionId = '123'

export async function loader() {
  
  let data = await currentState({sessionId})

  if(data.movesCore) {
    data.movesCore = movesCoreTransformer(data.movesCore);
  }

  return data
}

export default function Index() {

  let tableState = () : {tableResponse: TableResponse, possibleMoves: PossibleMove[]} => ({
    tableResponse: useLoaderData(),
    possibleMoves: []
  })

  const state = useState(tableState);

  return (
    <Grid container direction="row" alignItems="center" justifyContent="center" style={{height:"100vh"}}>
      <Grid container direction="row" alignItems="center" justifyContent="center" sx={{minWidth: "300px", maxWidth: "1300px"}}>
        <Grid container sx={{textAlign: "center"}} xs={12}>
          <Scoreboard state={state}/>
        </Grid>
        <Grid container lg={7} xs={12} direction="row" alignItems="center" justifyContent="center">
          <Table sessionId={sessionId} state={state} />
        </Grid>
        <Box sx={{ p: 2 }}/>
        <Grid container lg={3} xs={12} direction="row" alignItems="center" justifyContent="flex-end">
          <Settings sessionId={sessionId} state={state}/>
        </Grid>
      </Grid>
    </Grid>
  );
}
