import { Router } from "express";
import { spawn } from "child_process";
import { randomUUID } from "crypto";
import { setHostRoom } from "../state/roomState"
import { getLocalLanIp } from "../utils/getLocalLanIp";
import { startAdvertising } from "../utils/udpAdvertiser";
import getPort from "get-port";

const router = Router();



router.post("/", async (req, res) => {
    try{
        const gamePort = await getPort({ port: 3001 });

        const roomId = randomUUID().slice(0, 6);

        const hostIp = getLocalLanIp();

        const child = spawn(
            "node",
            ["-r", "ts-node/register", "src/index.ts"],
            {
                cwd: "../game",
                env: { ...process.env, PORT: gamePort.toString(), HOST: hostIp },
                stdio: "inherit",
            }
        );

        setHostRoom({
            roomId: roomId,
            port: gamePort,
            process: child
        })

        startAdvertising(roomId, gamePort, hostIp);

        res.json({
            message: "Room created successfully",
            roomId,
            gamePort,
            hostIp
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create a room" });
    }
});

export default router;