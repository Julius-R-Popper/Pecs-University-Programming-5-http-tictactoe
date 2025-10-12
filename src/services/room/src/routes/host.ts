import { Router } from "express";
import { spawn } from "child_process";
import { randomUUID } from "crypto";
import { setRoomPointerHost } from "../state/roomState"
import { getLocalLanIp } from "../utils/getLocalLanIp";
import { startAdvertising } from "../utils/udpAdvertiser";
import getPort from "get-port";

const router = Router();



router.post("/", async (req, res) => {
    try{
        const basePort = 3001;
        const gamePort = await getPort({ port: basePort });
        const rulesetPort = await getPort({ port: basePort + 1 });

        const roomId = randomUUID().slice(0, 3);

        const hostIp = getLocalLanIp();

        const identifierIp = randomUUID().slice(0, 3);//getLocalLanIp();

        const gameProcess = spawn(
            "node",
            ["-r", "ts-node/register", "src/index.ts"],
            {
                cwd: "../game",
                env: { ...process.env, PORT: gamePort.toString(), HOST: hostIp },
                stdio: "inherit",
            }
        );

        const rulesetProcess = spawn(
            "node",
            ["-r", "ts-node/register", "src/index.ts"],
            {
                cwd: "../ruleset",
                env: { ...process.env, PORT: rulesetPort.toString(), HOST: hostIp },
                stdio: "inherit",
            }
        );

        setRoomPointerHost({
            roomId: roomId,
            roomIp: hostIp,
            roomPort: gamePort,
            gameProcess: gameProcess,
            rulesetProcess: rulesetProcess,
            identifierIp: identifierIp//hostIp
        })

        startAdvertising(roomId, gamePort, hostIp);

        res.json({
            message: "Address set successfully. (HOST)",
            roomId: roomId,
            roomPort: gamePort,
            roomIp: hostIp,
            identifierIp: identifierIp
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create a room" });
    }
});

export default router;