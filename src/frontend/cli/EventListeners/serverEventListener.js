import { io } from "socket.io-client";
import {
    getGameAddress,
    getRoomRole,
    getSocketConnection,
    setGameAddress,
    setRoomRole,
    setSocketConnection
} from "../state.js";



export async function establishServerEventListener() {
    return new Promise((resolve) => {
        const role = getRoomRole();

        console.log(`My role is ${role}`);

        setSocketConnection(io(`http://${getGameAddress()}`));

        getSocketConnection().emit("player-join", { role } );

        getSocketConnection().on("join-success", (data) => {
            console.log(`Successfully joined as ${data.role} (${data.id})`);
        });

        getSocketConnection().on("game-start", async (data) => {
            console.log(data.message);
            resolve();
        });

        getSocketConnection().on("error-message", (err) => {
            console.error("Server error:", err.error);
        });

        getSocketConnection().on("disconnect-success", async () => {
            console.log("Disconnected from game server");

            getSocketConnection().off();
            getSocketConnection().close();
            setSocketConnection(null);

            await endGameServer();

            setGameAddress(null);
            setRoomRole(null);
        });
    })
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
