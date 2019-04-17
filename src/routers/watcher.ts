import express from 'express';
const router = express.Router();
import WatcherConroller from '../controllers/WatcherController';

router.get('/products', WatcherConroller.get_amazon_items);

export default router;