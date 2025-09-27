import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

app.get("/ping", (req, res) => {
    res.send("pong");
});


const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0"; // bind to all network interfaces

server.listen(PORT, HOST, () => {
    console.log(`Game service running on http://${HOST}:${PORT}`);
});


