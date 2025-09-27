import { ChildProcess } from "child_process";

export type HostRoom = {
    roomId: string;
    port: number;
    process?: ChildProcess;
};

export type RemoteRoom = {
    roomId: string;
    hostIp: string;
    port: number;
}

let hostRoom: HostRoom | null = null;
let remoteRoom: RemoteRoom | null = null;

export function getHostRoom() {
    return hostRoom;
}

export function setHostRoom(room: HostRoom | null) {
    hostRoom = room;
}

export function clearHostRoom(){
    hostRoom = null;
}

export function getRemoteRoom() {
    return remoteRoom;
}

export function setRemoteRoom(room: RemoteRoom | null) {
    remoteRoom = room;
}

export function clearRemoteRoom(){
    remoteRoom = null;
}
