import { connectRoom } from "./waitingRoom.js";
import { beginGame } from "./inGame.js";
import {endGame} from "./endGame.js";


export async function gameService() {
    await connectRoom();
    await beginGame();
    await endGame();
}

