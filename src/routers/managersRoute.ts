import express from 'express';
const router = express.Router();
import ManagerController from '../controllers/ManagerController';

router.post('/add-item', ManagerController.post_add_items);
router.patch('/item', ManagerController.patch_item);
router.get('/items', ManagerController.get_all_items);
router.get('/check-item', ManagerController.get_check_item);

export default router;