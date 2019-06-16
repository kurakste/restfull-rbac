import express from 'express';
const router = express.Router();
import ItemController from '../controllers/ItemController';

router.get('/', ItemController.get_product);
router.patch('/', ItemController.patch_product);
//router.post('/', ItemController.post_product);
// router.delete('/', ItemController.delete_product);

export default router;