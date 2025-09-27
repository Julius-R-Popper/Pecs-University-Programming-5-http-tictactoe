// src/index.ts
import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// Health check or root endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('Service is running');
});

// Example API route
app.get('/status', (req: Request, res: Response) => {
    res.json({
        service: 'chat', // change to game/room for other services
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});

// Example POST route
app.post('/message', (req: Request, res: Response) => {
    const { user, message } = req.body;
    // In a real service, you would handle storing or forwarding the message
    res.json({
        user,
        message,
        receivedAt: new Date().toISOString(),
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Service running on port ${PORT}`);
});
