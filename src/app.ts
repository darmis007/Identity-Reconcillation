import express, { Request, Response, NextFunction } from 'express';
import identityRouter from './routes/identityRouter';

const app = express();

app.use(express.json());

app.use('/identity', identityRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('An error occurred:', err);
  res.status(500).json({ error: 'An error occurred.' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app
