// #!/usr/bin/env node
//
// const inquirer = require("inquirer");
// const axios = require("axios");
//
// const BASE_URLS = {
//   chat: "http://localhost:3001",
//   game: "http://localhost:3002",
//   room: "http://localhost:3003",
// };
//
// async function mainMenu() {
//   const { action } = await inquirer.prompt([
//     {
//       type: "list",
//       name: "action",
//       message: "What do you want to do?",
//       choices: [
//         "Create Room",
//         "Join Room",
//         "Make Move",
//         "Send Chat Message",
//         "Exit",
//       ],
//     },
//   ]);
//
//   switch (action) {
//     case "Create Room":
//       await createRoom();
//       break;
//     case "Join Room":
//       await joinRoom();
//       break;
//     case "Make Move":
//       await makeMove();
//       break;
//     case "Send Chat Message":
//       await sendChat();
//       break;
//     case "Exit":
//       process.exit(0);
//   }
//
//   mainMenu();
// }
//
// async function createRoom() {
//   try {
//     const res = await axios.post(`${BASE_URLS.room}/create`);
//     console.log("Room created:", res.data);
//   } catch (err) {
//     console.error("Error:", err.message);
//   }
// }
//
// async function joinRoom() {
//   try {
//     const { roomId } = await inquirer.prompt([
//       { type: "input", name: "roomId", message: "Enter room ID:" },
//     ]);
//     const res = await axios.post(`${BASE_URLS.room}/join`, { roomId });
//     console.log("Joined room:", res.data);
//   } catch (err) {
//     console.error("Error:", err.message);
//   }
// }
//
// async function makeMove() {
//   try {
//     const { move } = await inquirer.prompt([
//       { type: "input", name: "move", message: "Enter your move (e.g. A1):" },
//     ]);
//     const res = await axios.post(`${BASE_URLS.game}/move`, { move });
//     console.log("Move result:", res.data);
//   } catch (err) {
//     console.error("Error:", err.message);
//   }
// }
//
// async function sendChat() {
//   try {
//     const { message } = await inquirer.prompt([
//       { type: "input", name: "message", message: "Enter message:" },
//     ]);
//     const res = await axios.post(`${BASE_URLS.chat}/send`, { message });
//     console.log("Chat sent:", res.data);
//   } catch (err) {
//     console.error("Error:", err.message);
//   }
// }
//
// mainMenu();
