import { Router } from "express";
import {getRoomPointerGuest, getRoomPointerHost} from "../state/roomState";


const router = Router();

router.get("/role", async (req, res) => {
    const { role } = req.body;

    if (!role || (role !== "HOST" && role !== "GUEST")) {
        return res.status(400).json({ error: "Invalid role. Must be 'HOST' or 'GUEST'" });
    }

    const response = role === "HOST" ? getHost() : getGuest();

    res.json({ result: response });
});

function getHost(): string | undefined {
    return getRoomPointerHost()?.identifierId;
}

function getGuest(): string | undefined {
    return getRoomPointerGuest()?.identifierId;
}

export default router;