import express from "express";
import http from "http";
import cors from 'cors';
import controllerRouter from "./routes/controller";

const app = express();
const server = http.createServer(app);

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.use(cors());
app.use(express.json());

app.use("/session", controllerRouter);
app.use("/session", controllerRouter);
app.use("/session", controllerRouter);
app.use("/session", controllerRouter);



const PORT = Number(process.env.PORT) || 3002;
const HOST = process.env.HOST || "0.0.0.0";

server.listen(PORT, HOST, () => {
    console.log(`Ruleset service running on https://${HOST}:${PORT}`);
});


