import { Router } from "express";
import { getRoomPointerHost, clearRoomPointerHost } from "../state/roomState";

const router = Router();

router.post("/", (req, res) => {
    const hostRoom = getRoomPointerHost();

    if(!hostRoom) {
        return res.status(404).json({ error: "No hosted room found." });
    }

    try{
        if(hostRoom.process && !hostRoom.process.killed){
            hostRoom.process.kill();
        }

        clearRoomPointerHost();

        res.json({ message: "Room closed successfully." });
    } catch (error) {
        console.log("Error closing room: ", error);
        res.status(500).json({ error: "Failed to close the room." });
    }
})

export default router;