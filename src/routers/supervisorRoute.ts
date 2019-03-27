import express from 'express';
const router = express.Router();
import SupervisorController from '../controllers/SupervisorController';

router.get('/get-free', SupervisorController.get_free);
router.get('/get-my-items', SupervisorController.get_my_items);
router.post('/pickup-item', SupervisorController.post_pickup_item);
router.patch('/item', SupervisorController.patch_item);
router.post('/change-status', SupervisorController.post_change_status);

export default router;