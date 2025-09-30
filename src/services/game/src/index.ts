import express from "express";
import http from "http";
import sessionRouter from "./routes/sessionController"
import actionsRouter from "./routes/move"
import cors from 'cors';

const app = express();
const server = http.createServer(app);

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.use(cors());
app.use(express.json());
app.use("/session", sessionRouter);
app.use("/actions", actionsRouter);


const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

server.listen(PORT, HOST, () => {
    console.log(`Game service running on https://${HOST}:${PORT}`);
});


