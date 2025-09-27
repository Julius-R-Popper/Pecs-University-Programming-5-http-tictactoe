import { Router, Request, Response } from "express";
import { getRemoteRooms } from "../utils/udpListerner";
import {RemoteRoom} from "../state/roomState";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const rooms: RemoteRoom[] = await getRemoteRooms(4000);

    if(rooms.length === 0){
        return res.status(404).json({message:"No room found"});
    }
    res.json(rooms);
})

export default router;