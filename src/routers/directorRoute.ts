import express from 'express';
const router = express.Router();
import directorController from '../controllers/DirectorController';

router.get('/vac', directorController.get_vac_product);
router.get('/my-products', directorController.get_my_products);
router.get('/paid', directorController.get_paid);
router.patch('/product', directorController.patch_product);
router.post('/pickup', directorController.post_pickup_item);
router.post('/make-payment', directorController.post_make_payment);
router.get('/get-all-checked-items', directorController.get_all_checked_items);
router.get('/users', directorController.get_all_users);
router.get('/get-all-free-items', directorController.get_all_free_items);
router.patch('/user', directorController.patch_user);
router.delete('/user', directorController.delete_user);
router.post('/make-items-paid', directorController.pos_make_items_paid);

export default router;