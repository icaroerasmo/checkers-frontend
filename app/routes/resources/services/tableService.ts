import { TableResponse, UserMove } from "../types";

export default async function userMove (userMove: UserMove): Promise<TableResponse> {

    const response = await fetch('http://localhost:8080/api/v1/user-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMove)
    });


    return await response.json();
}