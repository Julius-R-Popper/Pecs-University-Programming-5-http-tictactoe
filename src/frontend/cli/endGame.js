import {clearAll, getRoomRole} from "./state.js";

export async function endGame() {
    await endGameServer();
    clearGameData();
}

async function endGameServer() {
    const role = getRoomRole();

    try {
        if (role === "GUEST") {
            const res = await fetch("http://localhost:4000/leave", {
                method: "POST"
            });

            if (!res.ok) {
                throw new Error(`Failed to leave room: ${res.status}`);
            }

            console.log("You left the room successfully.");
        } else if (role === "HOST") {
            const res = await fetch("http://localhost:4000/close", {
                method: "POST"
            });

            if (!res.ok) {
                throw new Error(`Failed to close room: ${res.status}`);
            }

            console.log("You closed the room and stopped the game server.");
        } else {
            console.log("No valid role found — nothing to end.");
        }
    } catch (err) {
        console.error("Error ending game:", err.message);
    }
}

export function clearGameData() {
    try{
        clearAll();
        console.log("Local game data cleared.");
    } catch (err){
        console.error("Error clearing game data:", err.message);
    }

}