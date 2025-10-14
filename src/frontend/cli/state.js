import readline from "readline";

export const state = {
    RoomRole: null,
    GameAddress: null,
    SocketConnection: null
}

export const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

export function setRoomRole(role) {
    state.RoomRole = role;
}

export function getRoomRole() {
    return state.RoomRole;
}

export function setGameAddress(address) {
    state.GameAddress = address;
}

export function getGameAddress() {
    return state.GameAddress;
}

export function setSocketConnection(socket) {
    state.SocketConnection = socket;
}

export function getSocketConnection() {
    return state.SocketConnection;
}



