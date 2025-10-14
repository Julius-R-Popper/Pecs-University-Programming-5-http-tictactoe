import {DefaultEventsMap, Server, Socket} from "socket.io";
import {players} from "../state/state";
import { validateSocketId, validateCurrentTurn } from "../util/validateUser"
import {HOST, RULESET_PORT} from "../index";

export function handleJoin(socket: Socket<DefaultEventsMap, DefaultEventsMap>, {role}: any, io: Server<DefaultEventsMap, DefaultEventsMap>){

    if(role == "HOST"){
        if(players.hostSocketId) return socket.emit("error-message", { error: "Host already connected!"});
        players.hostSocketId = socket.id;
    } else if(role == "GUEST"){
        if(players.guestSocketId) return socket.emit("error-message", { error: "Guest already connected!"});
        players.guestSocketId = socket.id;
    }

    socket.emit("join-success", { id: socket.id, role: role });

    if(players.hostSocketId && players.guestSocketId) joinGame(io);
}

function joinGame(io: Server<DefaultEventsMap, DefaultEventsMap>) {
    console.log("Game ready!");
    io.emit("game-start", { message: "Both players connected!" })
}

export async function handleMove(socket: Socket<DefaultEventsMap, DefaultEventsMap>, {move}: any, io: Server<DefaultEventsMap, DefaultEventsMap>) {
    try {

        //make sure that socket is either guest or host
        validateSocketId(socket.id);

        //make sure that the socket is the current turn's socket id
        await validateCurrentTurn(socket.id);


        const response = await fetch(`http://${HOST}:${RULESET_PORT}/session/makeMove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                move: move,
                playerSocketId: socket.id
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Ruleset service error");
        }

        const result = await response.json();

        io.emit("move-success", result);

    } catch (err: any) {
        socket.emit("error-message", { error: err.message });
    }
}

export function handleDisconnect(socket: Socket, io: Server<DefaultEventsMap, DefaultEventsMap>) {
    console.log(`Disconnected: ${socket.id}`);
    if (players.hostSocketId === socket.id) players.hostSocketId = null;
    if (players.guestSocketId === socket.id) players.guestSocketId = null;
    io.emit("disconnect-success", { id: socket.id });
}