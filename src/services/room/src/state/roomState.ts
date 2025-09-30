import { ChildProcess } from "child_process";


export type RoomPointerHost = {
    roomId: string;
    roomIp: string;
    roomPort: number;
    identifierIp: string;
    process?: ChildProcess;
}

export type RoomPointerGuest = {
    roomId: string;
    roomIp: string;
    roomPort: number;
    identifierIp: string;
}

export type DiscoveredRooms = {
    roomId: string;
    roomIp: string;
    roomPort: number;
}


let roomPointerHost: RoomPointerHost | null = null;
let roomPointerGuest: RoomPointerGuest | null = null;

export function getRoomPointerHost() {
    return roomPointerHost;
}

export function setRoomPointerHost(room: RoomPointerHost | null) {
    roomPointerHost = room;
}

export function clearRoomPointerHost() {
    roomPointerHost = null;
}

export function getRoomPointerGuest() {
    return roomPointerGuest;
}

export function setRoomPointerGuest(room: RoomPointerGuest | null) {
    roomPointerGuest = room;
}

export function clearRoomPointerGuest() {
    roomPointerGuest = null;
}
