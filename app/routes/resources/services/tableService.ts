import { GameSession, TableResponse, UserMove, AutomatedMove, PossibleMove, MovesCore, PieceType, Settings } from "../models/types";

const baseUrl = 'http://localhost:8080/api/v1';

const cleanTable: TableResponse = {
    "movesCore":{
      "playerTurn":PieceType.RED,
      "redPieces":[],
      "bluePieces":[]
    },
    "movesLog":[],
    "captures":0
  }


export async function userMove (userMove: UserMove): Promise<TableResponse> {

    const response = await fetch(`${baseUrl}/user-move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMove)
    });


    return await response.json();
}

export async function minimaxMove (gameSession: GameSession): Promise<TableResponse> {

    const response = await fetch(`${baseUrl}/minimax-move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameSession)
    });


    return await response.json();
}

export async function currentState (gameSession: GameSession): Promise<TableResponse> {

    try {

        const response = await fetch(`${baseUrl}/current-state`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameSession)
        });

        return await response.json();

    } catch(e) {
        return cleanTable;
    }
}

export async function getPossibleMoves(automated: AutomatedMove): Promise<PossibleMove[]> {
    const response = await fetch(`${baseUrl}/possible-moves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(automated)
    });


    return await response.json();
}

export async function setSettings(settings: Settings): Promise<TableResponse> {
    const response = await fetch(`${baseUrl}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    });


    return await response.json();
}