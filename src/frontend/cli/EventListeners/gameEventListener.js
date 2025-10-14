import {RoomRole, SocketConnection, terminal,} from "../state.js";

const rl = terminal;

function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

async function formatBoard(board) {
    let output = "";
    for (let row = 0; row < 3; row++) {
        const cells = board
            .slice(row * 3, row * 3 + 3)
            .map(cell => cell === null ? " " : cell);
        output += ` ${cells[0]} | ${cells[1]} | ${cells[2]} \n`;
        if (row < 2) {
            output += "---+---+---\n";
        }
    }
    return output;
}

async function inputMove(){
    let move;
    while (true){
        move = await askQuestion("Your move (1-9): ");
        if (/^[1-9]$/.test(move)) break;
        console.log("Invalid move. Try again.");
    }

    SocketConnection.emit("player-move", {move: Number(move)});

    console.log(`You placed: ${move}`);
}

function waitForOpponent(){
    console.log("Waiting for opponent...");
}

async function printStatus(gameStatus){
    console.log("Board:", await formatBoard(gameStatus.board));
    console.log("Move made:", gameStatus.move);
    console.log("Played by:", gameStatus.by);
    console.log("Next turn:", gameStatus.nextTurn);
    console.log("Winner:", gameStatus.winner);
    console.log("Draw:", gameStatus.isDraw);
    console.log("Game over:", gameStatus.isGameOver);
}

export async function establishGameEventListener(){
    return new Promise(async (resolve) => {

        console.log(formatBoard(Array(9).fill(null)));
        if (RoomRole === "HOST") await inputMove();
        else if (RoomRole === "GUEST") waitForOpponent();

        SocketConnection.on("move-success", async (gameStatus) => {

            await printStatus(gameStatus);

            if(gameStatus.isGameOver){
                console.log("Game over!");
                if(gameStatus.winner) console.log(`Winner: ${gameStatus.winner}`);
                else if(gameStatus.isDraw) console.log("Draw!");

                SocketConnection.emit("player-disconnect");
                resolve();
                return;
            }

            if(RoomRole === gameStatus.nextTurn) {
                await inputMove();
            }else{
                waitForOpponent();
            }
        });
    })
}
