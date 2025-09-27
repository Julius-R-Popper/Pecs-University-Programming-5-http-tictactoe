import { Router } from "express";
import { getHostRoom, clearHostRoom } from "../state/roomState";

const router = Router();

router.post("/", (req, res) => {
    const hostRoom = getHostRoom();

    if(!hostRoom) {
        return res.status(404).json({ error: "No hosted room found." });
    }

    try{
        if(hostRoom.process && !hostRoom.process.killed){
            hostRoom.process.kill();
        }

        clearHostRoom();

        res.json({ message: "Room closed successfully." });
    } catch (error) {
        console.log("Error closing room: ", error);
        res.status(500).json({ error: "Failed to close the room." });
    }
})

export default router;