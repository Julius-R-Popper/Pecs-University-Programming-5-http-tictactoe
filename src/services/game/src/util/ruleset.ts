import { getSessionHost, getSessionGuest } from "../state/sessionState";

let board: (string | null)[] = Array(9).fill(null);
let currentTurn: "HOST" | "GUEST" = "HOST";
let gameOver = false;

const WINNING_COMBOS: [number, number, number][] = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

export function resetBoard() {
    board = Array(9).fill(null);
    currentTurn = "HOST";
    gameOver = false;
}

export function getBoard() {
    return board;
}

export function getTurn(){
    return currentTurn;
}

export function getGameOver(){
    return gameOver;
}

export function checkMove(move: number, ip: string) {
    if (gameOver) {
        throw new Error("Game is over");
    }

    const hostIp = getSessionHost();
    const guestIp = getSessionGuest();

    // Validate IP
    if (ip !== hostIp && ip !== guestIp) {
        throw new Error("Invalid IP");
    }

    // Validate turn
    if (currentTurn === "HOST" && ip !== hostIp) throw new Error("Not your turn");
    if (currentTurn === "GUEST" && ip !== guestIp) throw new Error("Not your turn");

    // Validate move
    if (move < 1 || move > 9) throw new Error("Move must be 1-9");
    const index = move - 1;
    if (board[index]) throw new Error("Cell already taken");

    // Apply move
    board[index] = currentTurn === "HOST" ? "X" : "O";

    // Check winner/draw
    const winner = checkWinner();
    const isDraw = !winner && board.every(cell => cell !== null);

    const result: any = {
        board,
        move,
        by: currentTurn,
        nextTurn: null,
        winner: null,
        isDraw: false,
        gameOver: false,
    };

    if (winner) {
        result.winner = currentTurn;
        result.gameOver = true;
        gameOver = true;
    } else if (isDraw) {
        result.isDraw = true;
        result.gameOver = true;
        gameOver = true;
    } else {
        currentTurn = currentTurn === "HOST" ? "GUEST" : "HOST";
        result.nextTurn = currentTurn;
    }

    return result;
}

function checkWinner() {
    for (const [a, b, c] of WINNING_COMBOS) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}
