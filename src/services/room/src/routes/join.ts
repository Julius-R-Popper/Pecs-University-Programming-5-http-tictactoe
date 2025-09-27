import { Router, Request, Response } from "express";
import {getHostRoom, getRemoteRoom, setRemoteRoom} from "../state/roomState";
import dgram from "dgram";
import { MULTICAST_ADDRESS, MULTICAST_PORT } from "../state/multicast";

const router = Router();

router.post("/", (req: Request, res: Response) => {
    const { roomId, hostIp, port } = req.body;

    if (!hostIp || !port || !roomId) {
        return res.status(400).json({ error: "hostIp and port are required" });
    }

    setRemoteRoom({
        roomId,
        hostIp,
        port
    });

    notifyHostStopAdvertising(roomId);

    console.log(`remote room connected to : `, getRemoteRoom());
    console.log(`host room connected to : `, getHostRoom())

    return res.json({
        message: "Joined room successfully",
        hostIp,
        port,
    });
});

function notifyHostStopAdvertising( roomId: string ) {
    const socket = dgram.createSocket("udp4");
    const message = JSON.stringify({ type: "STOP", roomId });
    socket.send(message, MULTICAST_PORT, MULTICAST_ADDRESS, (err) => {
        if (err) console.error("UDP send error:", err);
        socket.close();
    });
}

export default router;