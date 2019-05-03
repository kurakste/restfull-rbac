import express from 'express';
const router = express.Router();
import BuyerConroller from '../controllers/BuyerController';

router.get('/free-products', BuyerConroller.get_free_products);
router.get('/products', BuyerConroller.get_products);
router.post('/pickup-product', BuyerConroller.post_pickup_product);

export default router;