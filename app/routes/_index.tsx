import { V2_MetaFunction } from "@remix-run/node";
import { flexAlignCenter } from "./resources/util/styles";
import { currentState } from "./resources/services/tableService";
import { useLoaderData } from "@remix-run/react";
import { PLAYER_1_PIECE_COLOR, PLAYER_2_PIECE_COLOR } from "./resources/constants/colors";
import { useState } from "react";
import { TableResponse, PossibleMove } from "./resources/models/types";
import Table from "./resources/components/table";
import { movesCoreTransformer } from "./resources/util/helpers";
import Scoreboard from "./resources/components/scoreboard";

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
    <div style={flexAlignCenter}>
      <div>
        <Scoreboard state={state}/>
        <Table sessionId={sessionId} state={state} />
      </div>
    </div>
  );
}
