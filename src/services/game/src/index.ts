import express from "express";
import http from "http";
import cors from 'cors';
import { Server } from "socket.io";
import {handleDisconnect, handleJoin, handleMove} from "./routes/session";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

io.on("connection", (socket) => {

    socket.on("player-join", (data) => handleJoin(socket, data, io));

    socket.on("player-move", (data) => handleMove(socket, data, io));

    socket.on("player-disconnect", () => handleDisconnect(socket, io))

})

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.use(cors());
app.use(express.json());


export const PORT = Number(process.env.PORT) || 3001;
export const HOST = process.env.HOST || "0.0.0.0";

server.listen(PORT, HOST, () => {
    console.log(`Game service running on https://${HOST}:${PORT}`);
});


