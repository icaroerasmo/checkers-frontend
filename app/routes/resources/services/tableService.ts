import { GameSession, TableResponse, UserMove, AutomatedMove, PossibleMove } from "../types";

const baseUrl = 'http://localhost:8080/api/v1';

export async function userMove (userMove: UserMove): Promise<TableResponse> {

    const response = await fetch(`${baseUrl}/user-move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMove)
    });


    return await response.json();
}

export async function currentState (gameSession: GameSession): Promise<TableResponse> {

    const response = await fetch(`${baseUrl}/current-state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameSession)
    });


    return await response.json();
}

export async function getPossibleMoves(automated: AutomatedMove): Promise<PossibleMove[]> {
    const response = await fetch(`${baseUrl}/possible-moves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(automated)
    });


    return await response.json();
}