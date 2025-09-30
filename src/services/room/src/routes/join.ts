import { Router, Request, Response } from "express";
import { getRoomPointerHost, getRoomPointerGuest, setRoomPointerGuest} from "../state/roomState";
import dgram from "dgram";
import { MULTICAST_ADDRESS, MULTICAST_PORT } from "../state/multicast";
import {randomUUID} from "crypto";

const router = Router();

router.post("/", (req: Request, res: Response) => {
    const { roomId, roomIp, roomPort } = req.body;

    if (!roomIp || !roomPort || !roomId) {
        return res.status(400).json({ error: "game server's room IP and port are required" });
    }

    const identifierIp = randomUUID().slice(0, 3);

    setRoomPointerGuest({
        roomId: roomId,
        roomIp: roomIp,
        roomPort: roomPort,
        identifierIp: identifierIp
    });

    notifyHostStopAdvertising(roomId);

    console.log(`remote room connected to: ${getRoomPointerGuest()?.roomIp}:${getRoomPointerGuest()?.roomPort}`);
    console.log(`host room connected to: ${getRoomPointerHost()?.roomIp}:${getRoomPointerHost()?.roomPort}`);

    return res.json({
        message: "Address set successfully. (GUEST)",
        roomIp: roomIp,
        roomPort: roomPort,
        identifierIp: identifierIp
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