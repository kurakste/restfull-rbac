import express from 'express';
const router = express.Router();
import adminController from '../controllers/AdminController';

router.get('/waiting', adminController.get_waiting_products);
router.get('/vac', adminController.get_vac_products);
router.get('/checking', adminController.get_checking_products);
router.get('/paid', adminController.get_paid);
router.patch('/product', adminController.patch_product);
router.post('/pickup', adminController.post_pickup_item);
router.post('/make-payment', adminController.post_make_payment);
router.get('/users', adminController.get_all_users);
router.patch('/user', adminController.patch_user);
router.delete('/user', adminController.delete_user);

export default router;