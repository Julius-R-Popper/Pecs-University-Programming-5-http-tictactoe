import dgram from "dgram";
import { clearInterval, setInterval } from "node:timers";
import { MULTICAST_ADDRESS, MULTICAST_PORT } from "../state/multicast";

let interval :NodeJS.Timeout | null = null;
let socket: dgram.Socket | null = null;

export function startAdvertising(roomId: string, gamePort: number, hostIp: string){
    stopAdvertising();

    socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

    const message = JSON.stringify({
        type: "ROOM_ANNOUNCE",
        roomId,
        hostIp,
        port: gamePort
    });

    interval = setInterval(() => {
        if(socket){
            socket.send(message, MULTICAST_PORT, MULTICAST_ADDRESS);
        }
    }, 2000);
    console.log(`Advertising room: ${roomId} on ${hostIp}:${gamePort}`);

    socket.on("message", (msg, rinfo) => {
        try {
            const data = JSON.parse(msg.toString());
            if (data.type === "STOP" && data.roomId === roomId) {
                console.log(`Received STOP for room ${roomId} from ${rinfo.address}, stopping advertiser`);
                stopAdvertising();
            }
        } catch (err) {
            console.error("Error parsing UDP message:", err);
        }
    });

    socket.bind(MULTICAST_PORT, () => {
        socket?.setBroadcast(true);
        socket?.setMulticastTTL(128);
        socket?.addMembership(MULTICAST_ADDRESS);
    });

}

export function stopAdvertising() {
    if(interval){
        clearInterval(interval);
        interval = null;
    }

    if(socket){
        socket.close();
        socket = null;
    }
    console.log("Stopped advertising room");
}