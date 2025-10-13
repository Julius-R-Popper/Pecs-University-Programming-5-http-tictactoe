import {Router} from "express";
import {getBoard, getGameOver, getTurn, makeMove} from "../util/ruleset";

const router = Router();

router.post("/makeMove", async (req, res) => {
    const { move, playerSocketId } = req.body;

    try {
         const result = makeMove(move, playerSocketId);
         res.json(result);
    } catch (error){
         console.error(error);
         res.status(500).json({ error: "Failed to apply move" });
    }
});

router.get("/getTurn", async (req, res) => {
    try{
        const result = getTurn();
        res.json(result);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Failed to get Turn" });
    }
});

router.get("/getGameOver", async (req, res) => {
    try{
        const result = getGameOver();
        res.json(result);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Failed to get Game Over" });
    }
});

router.get("/getBoard", async (req, res) => {
    try{
        const result = getBoard();
        res.json(result);
    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Failed to get Board" });
    }
});


export default router;