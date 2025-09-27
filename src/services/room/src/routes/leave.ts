import { Router } from "express";
import { getRemoteRoom, clearRemoteRoom } from "../state/roomState";

const router = Router();

router.post("/", (req, res) => {
    const joinedRoom = getRemoteRoom();

    if (!joinedRoom) {
        return res.status(404).json({ error: "No joined room found" });
    }

    try {
        clearRemoteRoom();

        res.json({ message: "Left the room successfully" });
    } catch (err) {
        console.error("Error leaving room:", err);
        res.status(500).json({ error: "Failed to leave the room" });
    }
});

export default router;
