import {getGameAddress, getRoomRole, getUserIdentifierIp, terminal,} from "./state.js";

function sleep(ms = 2000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const rl = terminal;

let waitPrompt = true;

function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

async function checkGameStatus(){
    const { result } = await (await fetch(`http://${getGameAddress()}/actions/status`)).json();
    return result
}

async function getBoardInfo(){
    const boardRes = await fetch(`http://${getGameAddress()}/actions/board`);
    const { board } = await boardRes.json();
    return board;
}

export async function beginGame() {
    const role = getRoomRole();
    const ip = getUserIdentifierIp();

    let gameOver = false;

    while (!gameOver) {
        try {


            const turnRes = await fetch(`http://${getGameAddress()}/actions/turn`);
            const { turn } = await turnRes.json();


            if (await checkGameStatus() === "finished") {
                console.log("Game over!");
                gameOver = true;
                break;
            }

            if (turn !== role) {
                if (waitPrompt) {
                    console.log("Waiting for opponent...")
                    waitPrompt = false;
                }
                await sleep();
                continue;
            }
            waitPrompt = true;

            const beforePlaced = await getBoardInfo();
            console.log(`Place your piece!\n${beforePlaced}`);

            let move;
            while (true) {
                move = await askQuestion("Your move (1-9): ");
                if (/^[1-9]$/.test(move)) break;
                console.log("Invalid move. Try again.");
            }

            await fetch(`http://${getGameAddress()}/actions/move`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ move: Number(move), ip }),
            });

            const afterPlaced = await getBoardInfo();
            console.log(`You made your move!\n${afterPlaced}`);


            if (await checkGameStatus() === "finished") {
                console.log("Game over!");
                gameOver = true;
                break;
            }

        } catch (err) {
            console.error("Error during game loop:", err.message);
            await sleep();
        }
    }

    rl.close();
}
