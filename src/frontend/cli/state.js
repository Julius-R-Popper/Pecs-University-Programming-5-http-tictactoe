import readline from "readline";

let RoomRole;
let UserIdentifierIp;
let GameAddress;
let SocketConnection;

export const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

export function getRoomRole() {
    return RoomRole;
}

export function setRoomRole(roomRole) {
    RoomRole = roomRole;
}

export function getUserIdentifierIp() {
    return UserIdentifierIp;
}

export function setUserIdentifierIp(userIdentifierIp) {
    UserIdentifierIp = userIdentifierIp;
}


export function getGameAddress() {
    return GameAddress;
}

export function setGameAddress(gameAddress) {
    GameAddress = gameAddress;
}

export function getSocket() {
    return SocketConnection;
}

export function setSocket(socketInstance) {
    SocketConnection = socketInstance;
}

export function clearSocket() {
    if (SocketConnection) {
        SocketConnection.disconnect();
        SocketConnection = null;
    }
}



export function clearAll(){
    GameAddress = null;
    UserIdentifierIp = null;
    RoomRole = null;
    clearSocket();
}

