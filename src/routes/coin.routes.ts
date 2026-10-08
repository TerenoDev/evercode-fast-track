import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as coinController from '../controllers/coin.controller';

const router = Router();

router.use(authenticate);

router.get('/', coinController.getAllCoins);
router.post('/', coinController.addCoin);
router.delete('/:id', coinController.deleteCoin);

router.get('/:symbol/price', coinController.getCoinPrice);
router.get('/:symbol/history', coinController.getCoinHistory);

export default router;