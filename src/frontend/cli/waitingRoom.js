import { getGameAddress, getRoomRole, getUserIdentifierIp } from "./state.js";

export async function connectRoom() {
    const type = getRoomRole();
    const ip = getUserIdentifierIp();
    const gameServerBase = `http://${getGameAddress()}`;

    try {
        const connectRes = await fetch(`${gameServerBase}/session/connect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, ip })
        });

        if (!connectRes.ok) throw new Error(`Connection failed with status ${connectRes.status}`);

        console.log("Registered with game server");

        // Step 2: Poll /session until isReady is true
        let lobbyData;
        let isReady = false;

        while (!isReady) {
            const sessionRes = await fetch(`${gameServerBase}/session/isReady`);
            if (!sessionRes.ok) throw new Error(`Failed to get session status: ${sessionRes.status}`);

            lobbyData = await sessionRes.json();
            console.log("Lobby status:", lobbyData);

            if (lobbyData.isReady) {
                isReady = true;
            } else {
                console.log("Waiting for opponent...");
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        console.log("Opponent connected. Ready to start game:", lobbyData);
        return lobbyData;

    } catch (err) {
        console.error("Failed during room connection:", err.message);
    }
}
