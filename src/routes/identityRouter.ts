import express, { Request, Response } from 'express';
import identityController from '../controllers/identityController';
import IdentityRequest from '../models/identityRequest';

const router = express.Router();

router.post('/identify', async (req: Request<any, any, IdentityRequest>, res: Response) => {
  identityController.identify(req, res);
});

export default router;
