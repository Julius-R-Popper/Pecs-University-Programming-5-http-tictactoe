import { io } from "socket.io-client";
import {GameAddress, RoomRole, SocketConnection} from "../state.js";


export async function establishServerEventListener() {
    return new Promise((resolve) => {
        const role = RoomRole;

        SocketConnection = io(`http://${GameAddress}`);

        SocketConnection.emit("player-join", role );

        SocketConnection.on("join-success", (data) => {
            console.log(`Successfully joined as ${data.role} (${data.id})`);
        });

        SocketConnection.on("game-start", async (data) => {
            console.log(data.message);
            resolve();
        });

        SocketConnection.on("error-message", (err) => {
            console.error("Server error:", err.error);
        });

        SocketConnection.on("disconnect-success", async () => {
            console.log("Disconnected from game server");

            SocketConnection.off();
            SocketConnection.close();
            SocketConnection = null;

            await endGameServer();

            GameAddress = null;
            RoomRole = null;
        });
    })
}

async function endGameServer() {
    const role = RoomRole;

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
