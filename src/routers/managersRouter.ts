import express from 'express';
const router = express.Router();
import ManagerController from '../controllers/ManagerController';

router.post('/product', ManagerController.post_add_product);
router.patch('/product', ManagerController.patch_product);
router.delete('/product', ManagerController.delete_product);
router.get('/products', ManagerController.get_all_products);
router.get('/parse-amazon', ManagerController.get_parse_amazon);
router.get('/parse-sellercentral', ManagerController.get_parse_sellercentral);
router.get('/check-product', ManagerController.get_check_product);

export default router;