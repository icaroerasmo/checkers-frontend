import { V2_MetaFunction } from "@remix-run/node";
import { displayFlex } from "./resources/util/styles";
import { currentState } from "./resources/services/tableService";
import { useLoaderData } from "@remix-run/react";
import { PLAYER_1_PIECE_COLOR, PLAYER_2_PIECE_COLOR } from "./resources/constants/colors";
import { useState } from "react";
import { TableResponse, PossibleMove } from "./resources/models/types";
import Table from "./resources/components/table";
import { movesCoreTransformer } from "./resources/util/helpers";

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

  const [data, setData] = useState(tableState);

  return (
    <div style={displayFlex}>
      <div>
        <div style={displayFlex}>
          <div style={{color: PLAYER_1_PIECE_COLOR}}>
            <h1>Red {data.tableResponse.movesCore.redPieces.length}</h1>
          </div>
          <div style={{padding: "0 2em 0 2em"}}></div>
          <div style={{color: PLAYER_2_PIECE_COLOR}}>
            <h1>{data.tableResponse.movesCore.bluePieces.length} Blue</h1>
          </div>
        </div>
        <Table sessionId={sessionId} data={data} setData={setData} />
      </div>
    </div>
  );
}
