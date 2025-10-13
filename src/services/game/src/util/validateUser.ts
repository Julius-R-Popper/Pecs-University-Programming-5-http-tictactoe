import {players} from "../state/state";
import {HOST, PORT} from "../index";

export function validateSocketId(playerSocketId: string){
    if (playerSocketId !== players.hostSocketId && playerSocketId !== players.guestSocketId) {
        throw new Error("Invalid Id");
    }
}

export async function validateCurrentTurn(playerSocketId : string){
    try{
        const response = await fetch(`http://${HOST}:${PORT + 1}/session/getTurn`);
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Failed to fetch current turn");
        }

        const data = await response.json();
        const currentTurn: "HOST" | "GUEST" = data.turn;

        if (currentTurn === "HOST" && playerSocketId !== players.hostSocketId) throw new Error("Not your turn");
        if (currentTurn === "GUEST" && playerSocketId !== players.guestSocketId) throw new Error("Not your turn");
    }catch (err: any) {
        throw new Error(err.message);
    }
}