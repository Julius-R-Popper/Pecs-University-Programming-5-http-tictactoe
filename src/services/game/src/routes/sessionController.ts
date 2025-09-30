import { Router } from "express";
import {
    setHostIp,
    setGuestIp,
    getSession,
} from "../state/sessionState";

const router = Router();

router.post("/connect", (req, res) => {
    const { type, ip } = req.body;

    if (!type || !ip) {
        return res.status(400).json({ error: "Missing type or ip" });
    }

    try {
        if (type === "HOST") {
            setHostIp(ip);
        } else if (type === "GUEST") {
            setGuestIp(ip);
        } else {
            return res.status(400).json({ error: "Invalid type" });
        }

        const session = getSession();
        const isReady = !!(session.hostIp && session.guestIp);

        return res.json({ session, isReady });
    } catch (err: any) {
        return res.status(409).json({ error: err.message });
    }
});

router.get("/", (req, res) => {
    res.json(getSession());
});

router.get("/isReady", (req, res) => {
    const session = getSession();
    res.json({
        isReady: !!(session.hostIp && session.guestIp)
    });
});

export default router;
