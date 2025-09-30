import { connectRoom } from "./waitingRoom.js";
import { beginGame } from "./inGame.js";


export async function gameService() {
    await connectRoom();
    await beginGame();
}

