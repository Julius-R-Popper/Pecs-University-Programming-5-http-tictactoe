import { Router } from "express";
import {
    setHostIp,
    setRemoteIp,
    getSession,
} from "./sessionState";

const router = Router();

router.post("/connect", (req, res) => {
    const { type, ip } = req.body;

    if (!type || !ip) {
        return res.status(400).json({ error: "Missing type or ip" });
    }

    try {
        if (type === "HOST") {
            setHostIp(ip);
        } else if (type === "REMOTE") {
            setRemoteIp(ip);
        } else {
            return res.status(400).json({ error: "Invalid type" });
        }

        const session = getSession();
        const isReady = !!(session.hostIp && session.remoteIp);

        return res.json({ session, isReady });
    } catch (err: any) {
        return res.status(409).json({ error: err.message });
    }
});

router.get("/", (req, res) => {
    res.json(getSession());
});

export default router;
