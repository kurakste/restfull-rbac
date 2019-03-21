import express from 'express';
const router = express.Router();
import AdminController from '../controllers/AdminController';

router.get('/users', AdminController.get_all_users);
router.get('/get-all-items', AdminController.get_all_items);
router.patch('/user', AdminController.patch_user);
router.delete('/user', AdminController.delete_user);

export default router;