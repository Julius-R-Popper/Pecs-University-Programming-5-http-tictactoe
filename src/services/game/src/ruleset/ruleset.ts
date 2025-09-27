// import express, {Request, Response} from "express";
// import bodyParser from "body-parser";
// import {randomUUID} from "crypto";
// import http from "http";
//
// const app = express();
// app.use(bodyParser.json());
//
//
//
// // --- Game State ---
// type Player = {
//     id: string;
//     name: string;
// };
//
// type GameState = {
//     board: string[]; // simple tic-tac-toe board (9 cells)
//     players: Player[];
//     turn: string | null; // playerId of whose turn it is
//     winner: string | null;
// };
//
// const state: GameState = {
//     board: Array(9).fill(""),
//     players: [],
//     turn: null,
//     winner: null,
// };
//
// // --- Helpers ---
// function checkWinner(board: string[]): string | null {
//     const lines: [number, number, number][] = [
//         [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
//         [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
//         [0, 4, 8], [2, 4, 6],             // diagonals
//     ];
//     for (let [a, b, c] of lines) {
//         if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//             return board[a];
//         }
//     }
//     return null;
// }
//
// // --- Routes ---
//
// // Join the game
// app.post("/join", (req: Request, res: Response) => {
//     const { name } = req.body;
//     if (state.players.length >= 2) {
//         return res.status(400).json({ error: "Game already has 2 players" });
//     }
//
//     const player: Player = { id: randomUUID(), name };
//     state.players.push(player);
//
//     // Assign marks
//     const mark = state.players.length === 1 ? "X" : "O";
//
//     // Set first turn if not already
//     if (!state.turn) {
//         state.turn = player.id;
//     }
//
//     res.json({
//         playerId: player.id,
//         mark,
//         message: `Joined as ${mark}`,
//     });
// });
//
// // Get current state
// app.get("/state", (req: Request, res: Response) => {
//     res.json(state);
// });
//
// // Make a move
// app.post("/move", (req: Request, res: Response) => {
//     const { playerId, index } = req.body;
//
//     if (state.winner) {
//         return res.status(400).json({ error: "Game already finished" });
//     }
//     if (state.turn !== playerId) {
//         return res.status(400).json({ error: "Not your turn" });
//     }
//     if (state.board[index]) {
//         return res.status(400).json({ error: "Cell already taken" });
//     }
//
//     // Determine mark for this player
//     const playerIndex = state.players.findIndex((p) => p.id === playerId);
//     if (playerIndex === -1) {
//         return res.status(400).json({ error: "Player not found" });
//     }
//     const mark = playerIndex === 0 ? "X" : "O";
//
//     // Make move
//     state.board[index] = mark;
//
//     // Check for winner
//     const winner = checkWinner(state.board);
//     if (winner) {
//         state.winner = winner;
//     } else {
//         // Switch turn
//         state.turn = state.players.find((p) => p.id !== playerId)?.id || null;
//     }
//
//     res.json(state);
// });
//
// // Leave game
// app.post("/leave", (req: Request, res: Response) => {
//     const { playerId } = req.body;
//     state.players = state.players.filter((p) => p.id !== playerId);
//
//     if (state.players.length === 0) {
//         // Reset game if empty
//         state.board = Array(9).fill("");
//         state.turn = null;
//         state.winner = null;
//     }
//
//     res.json({ message: "Left game" });
// });
//
// const PORT = process.env.PORT || 3001;
// const HOST = process.env.HOST || "0.0.0.0"; // listen on all network interfaces
//
// const server = http.createServer(app);
//
// server.listen(PORT, HOST, () => {
//     console.log(`Game service running on http://${HOST}:${PORT}`);
// });