import { Router } from "express";
import {checkMove, getBoard, getGameOver, getTurn, resetBoard} from "../util/ruleset";
import {formatBoard} from "../util/formatBoard";

const router = Router();

router.post("/move", (req, res) => {
    const { move, ip } = req.body;

    if (!move || !ip) {
        return res.status(400).json({ error: "Missing move or ip" });
    }

    try {
        const result = checkMove(move, ip);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});



router.get("/board", (req, res) => {
    try {
        const result = getBoard();
        res.json({
            board: formatBoard(result)
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});


router.post("/restart", (req, res) => {
    try {
        resetBoard();
        const result = getBoard();
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/status", (req, res) => {
    try{
        const status = getGameOver();
        res.json({
            status: status
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/turn", (req, res) => {
    try{
        const turn = getTurn();
        res.json({
            turn: turn
        });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});




export default router;