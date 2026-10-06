import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as coinController from '../controllers/coin.controller';

const router = Router();

router.use(authenticate);

router.get('/', coinController.getAllCoins);
router.post('/', coinController.addCoin);
router.delete('/:id', coinController.deleteCoin);

export default router;