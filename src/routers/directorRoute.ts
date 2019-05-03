import express from 'express';
const router = express.Router();
import directorController from '../controllers/DirectorController';

router.get('/users', directorController.get_all_users);
router.get('/vac', directorController.get_vac_product);
router.get('/get-all-checked-items', directorController.get_all_checked_items);
router.get('/get-all-free-items', directorController.get_all_free_items);
router.patch('/item', directorController.patch_item);
router.patch('/user', directorController.patch_user);
router.delete('/user', directorController.delete_user);
router.post('/make-items-paid', directorController.pos_make_items_paid);

export default router;