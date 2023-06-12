import { V2_MetaFunction } from "@remix-run/node";
import { currentState } from "./resources/services/tableService";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { TableResponse, PossibleMove } from "./resources/models/types";
import Table from "./resources/components/table";
import { movesCoreTransformer } from "./resources/util/helpers";
import Scoreboard from "./resources/components/scoreboard";
import { Grid } from "@mui/material";
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
      <Grid container direction="row" alignItems="center" justifyContent="space-between" sx={{minWidth: "500px", maxWidth: "1300px"}}>
        <Grid container direction="row" alignItems="center" justifyContent="center" item lg={8} xs={12}>
          <Table sessionId={sessionId} state={state} />
        </Grid>
        <Grid item lg={4} xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Scoreboard state={state}/>
            </Grid>
            <Grid item xs={12}>
              <Settings sessionId={sessionId} state={state}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
