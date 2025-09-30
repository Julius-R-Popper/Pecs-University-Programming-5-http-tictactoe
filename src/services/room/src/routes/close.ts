import { Router } from "express";
import { getRoomPointerHost, clearRoomPointerHost } from "../state/roomState";

const router = Router();

router.post("/", (req, res) => {
    const hostRoom = getRoomPointerHost();

    if (!hostRoom) {
        return res.status(404).json({ error: "No hosted room found." });
    }

    try {
        if (hostRoom.process && !hostRoom.process.killed) {
            // Attach a one-time exit listener
            hostRoom.process.once("exit", (code, signal) => {
                console.log(`Game server exited with code ${code}, signal ${signal}`);
                clearRoomPointerHost();
                res.json({ message: "Room closed successfully." });
            });

            // Kill the process
            hostRoom.process.kill();
        } else {
            clearRoomPointerHost();
            res.json({ message: "Room already stopped." });
        }
    } catch (error) {
        console.error("Error closing room:", error);
        res.status(500).json({ error: "Failed to close the room." });
    }
});


export default router;