import express from "express";

import hostRouter from "./routes/host";
import joinRouter from "./routes/join";
import closeRouter from "./routes/close"
import searchRouter from "./routes/search";
import leaveRouter from "./routes/leave";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use("/host", hostRouter);
app.use("/join", joinRouter);
app.use("/close", closeRouter);
app.use("/search", searchRouter);
app.use("/leave", leaveRouter);


app.listen(PORT, () => {
    console.log(`Room service running on http://localhost:${PORT}`);
});
