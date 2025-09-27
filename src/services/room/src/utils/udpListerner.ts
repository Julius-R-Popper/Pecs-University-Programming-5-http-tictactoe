import dgram from "dgram";
import { RemoteRoom } from "../state/roomState"
import { MULTICAST_ADDRESS, MULTICAST_PORT } from "../state/multicast";


export async function getRemoteRooms(timeout: number): Promise<RemoteRoom[]> {
    return new Promise((resolve, reject) => {
        const discovered: Map<string, RemoteRoom> = new Map();
        const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

        socket.on("error", (err) => {
            console.error("UDP socket error:", err);
            socket.close();
            reject(err);
        });

        socket.on("message", (msg, rinfo) => {
            try {
                const data = JSON.parse(msg.toString());
                if (data.roomId && data.port) {
                    discovered.set(data.roomId, {
                        roomId: data.roomId,
                        hostIp: rinfo.address,
                        port: data.port,
                    });
                    console.log("detected address", rinfo.address);
                }
            } catch (err) {
                console.error("Bad UDP message:", err);
            }
        });

        socket.bind(MULTICAST_PORT, () => {
            socket.addMembership(MULTICAST_ADDRESS);
        });

        setTimeout(() => {
            socket.close();
            resolve([...discovered.values()]);
        }, timeout);
    });
}
