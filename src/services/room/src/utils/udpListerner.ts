import dgram from "dgram";
import { MULTICAST_ADDRESS, MULTICAST_PORT } from "../state/multicast";
import {DiscoveredRooms} from "../state/roomState";



export async function getRemoteRooms(timeout: number): Promise<DiscoveredRooms[]> {
    return new Promise((resolve, reject) => {
        const discovered: Map<string, DiscoveredRooms> = new Map();
        const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

        socket.on("error", (err) => {
            console.error("UDP socket error:", err);
            socket.close();
            reject(err);
        });

        socket.on("message", (msg, rinfo) => {
            try {
                const data = JSON.parse(msg.toString());
                if (data.roomId && data.roomPort) {
                    discovered.set(data.roomId, {
                        roomId: data.roomId,
                        roomIp: data.roomIp,
                        roomPort: data.roomPort,
                    });
                    console.log("Detected gaming room address", data.roomIp, ":", data.roomPort, "hosted by", rinfo.address);
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
