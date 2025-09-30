
import {setGameAddress, setRoomRole, setUserIdentifierIp, terminal} from "./state.js";
import { gameService } from "./gameService.js";

const rl = terminal;
let inRoom = false;

async function handleGameOrMenu(){
    if(inRoom){
        await gameService();
        inRoom = false;
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
        const data = await res.json();
        console.log("Room hosted:", data);
        inRoom = true;
        setRoomRole("HOST");
        console.log(data.identifierIp);
        setUserIdentifierIp(data.identifierIp);
        console.log(`Address set to ${data.roomIp}:${data.roomPort} for play`);
        setGameAddress(`${data.roomIp}:${data.roomPort}`)
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
        console.log(data.identifierIp);
        setUserIdentifierIp(data.identifierIp);
        console.log(`Address set to ${data.roomIp}:${data.roomPort} for play`);
        setGameAddress(`${data.roomIp}:${data.roomPort}`)
    } catch (err) {
        console.error("Error joining room:", err.message);
    }
}

function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

mainMenu();
