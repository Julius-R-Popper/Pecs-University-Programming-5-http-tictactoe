import { Router } from "express";
import { getRoomPointerGuest, clearRoomPointerGuest } from "../state/roomState";

const router = Router();

router.post("/", (req, res) => {
    const joinedRoom = getRoomPointerGuest();

    if (!joinedRoom) {
        return res.status(404).json({ error: "No joined room found" });
    }

    try {
        clearRoomPointerGuest();

        res.json({ message: "Left the room successfully" });
    } catch (err) {
        console.error("Error leaving room:", err);
        res.status(500).json({ error: "Failed to leave the room" });
    }
});

export default router;
