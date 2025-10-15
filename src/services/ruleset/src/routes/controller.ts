import {Router} from "express";
import {getBoard, getGameOver, getTurn, makeMove} from "../util/ruleset";

const router = Router();

router.post("/makeMove", async (req, res) => {
    const { move } = req.body;

    if (!move ) {
        return res.status(400).json({ error: "Missing move" });
    }

    try {
         const result = makeMove(move);
         res.json(result);
    } catch (error : any){
         console.error(error);
         res.status(400).json({ error: error.message });
    }
});

router.get("/getTurn", async (req, res) => {
    try{
        const turn = getTurn();
        res.json(turn);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Failed to get Turn" });
    }
});

router.get("/isGameOver", async (req, res) => {
    try{
        const isGameOver = getGameOver();
        res.json(isGameOver);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Failed to get Game Over" });
    }
});

router.get("/getBoard", async (req, res) => {
    try{
        const board = getBoard();
        res.json(board);
    } catch (error : any){
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});


export default router;