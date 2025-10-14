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

        const gamePort = await getPort();
        const rulesetPort = await getPort();

        const roomId = randomUUID().slice(0, 3);

        const hostIp = getLocalLanIp();

        const identifierId = randomUUID().slice(0, 3);//getLocalLanIp();

        console.log("game port on", gamePort.toString())
        console.log("ruleset port on", rulesetPort.toString())

        const gameProcess = spawn(
            "node",
            ["-r", "ts-node/register", "src/index.ts"],
            {
                cwd: "../game",
                env: { ...process.env, PORT: gamePort.toString(), HOST: hostIp, RULESET_PORT: rulesetPort.toString() },
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
            identifierId: identifierId
        })

        startAdvertising(roomId, gamePort, hostIp);

        res.json({
            message: "Address set successfully. (HOST)",
            roomId: roomId,
            roomPort: gamePort,
            roomIp: hostIp,
            identifierId: identifierId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create a room" });
    }
});

export default router;