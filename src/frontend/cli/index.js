
import {setGameAddress, setRoomRole, state, terminal} from "./state.js";
import {establishServerEventListener} from "./EventListeners/serverEventListener.js";
import {establishGameEventListener} from "./EventListeners/gameEventListener.js";


const rl = terminal;
let inRoom = false;

async function handleGameOrMenu(){
    if(inRoom){
        await establishServerEventListener();
        await establishGameEventListener();
        inRoom = false;
        console.log("Disconnected from the game server.")
    }
    mainMenu();
}

function mainMenu() {
    console.log("\n=== CLI Game Menu ===");
    console.log("1 - Host Room");
    console.log("2 - Search Room");
    console.log("3 - Join Room");
    console.log("0 - Exit");

    rl.question("Choose an option: ", async (choice) => {
        switch (choice) {
            case "1":
                await hostRoom();
                break;
            case "2":
                await searchRoom();
                break;
            case "3":
                await joinRoomManually();
                break;
            case "0":
                console.log("Exiting...");
                rl.close();
                process.exit();
                return;
            default:
                console.log("Invalid choice. Try again.");
        }

        await handleGameOrMenu()
    });
}

async function hostRoom() {
    try {
        const res = await fetch("http://localhost:4000/host", {
            method: "POST"
        });
        const hostRoomData = await res.json();
        console.log("Room hosted:", hostRoomData);
        inRoom = true;
        setRoomRole("HOST");
        console.log(`Address set to ${hostRoomData.roomIp}:${hostRoomData.roomPort} for play`);
        setGameAddress(`${hostRoomData.roomIp}:${hostRoomData.roomPort}`);
    } catch (err) {
        console.error("Error hosting room:", err.message);
    }
}

async function searchRoom() {
    try {
        const res = await fetch("http://localhost:4000/search", {
            method: "GET"
        });
        const data = await res.json();
        console.log("Available rooms:", data);
    } catch (err) {
        console.error("Error searching rooms:", err.message);
    }
}

async function joinRoomManually() {
    try {
        const roomId = await askQuestion("Enter room ID: ");
        const roomIp = await askQuestion("Enter game server IP: ");
        const port = await askQuestion("Enter port: ");

        const res = await fetch("http://localhost:4000/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                roomId: roomId,
                roomIp: roomIp,
                roomPort: Number(port),
            })
        });
        const data = await res.json();
        console.log("Joined room:", data);
        inRoom = true;
        setRoomRole("GUEST");
        console.log(`Address set to ${data.roomIp}:${data.roomPort} for play`);
        setGameAddress(`${data.roomIp}:${data.roomPort}`);

    } catch (err) {
        console.error("Error joining room:", err.message);
    }
}

function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

mainMenu();
