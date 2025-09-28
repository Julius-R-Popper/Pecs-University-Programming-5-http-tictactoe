import { Router } from "express";
import {checkMove, getBoard, resetBoard} from "../ruleset/ruleset";

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
        res.json(result);
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


export default router;