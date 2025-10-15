import { Router } from "express";
import { getRoomPointerHost, clearRoomPointerHost } from "../state/roomState";
import { ChildProcess } from "child_process";

const router = Router();

router.post("/", async (req, res) => {
    const hostRoom = getRoomPointerHost();

    if (!hostRoom) {
        return res.status(404).json({error: "No hosted room found."});
    }

    try {
        const closeProcess = (process: ChildProcess | undefined, name: string) => {
            return new Promise((resolve) => {
                if (process && !process.killed) {
                    process.once("exit", (code, signal) => {
                        console.log(`${name} exited with code ${code}, signal ${signal}`);
                        resolve({ name, status: "closed", code, signal });
                    });
                    process.kill();
                } else {
                    resolve({ name, status: "already stopped" });
                }
            });
        };

        // Wait for both the game and ruleset processes to close
        const results = await Promise.all([
            closeProcess(hostRoom.gameProcess, "Game server"),
            closeProcess(hostRoom.rulesetProcess, "Ruleset server"),
        ]);

        clearRoomPointerHost();

        res.json({
            message: "Room closed successfully.",
            details: results,
        });
    } catch (error) {
        console.error("Error closing room:", error);
        res.status(500).json({ error: "Failed to close the room." });
    }
});



export default router;