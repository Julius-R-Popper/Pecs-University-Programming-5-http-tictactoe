import readline from "readline";

export let RoomRole;
export let GameAddress;
export let SocketConnection;

export const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

