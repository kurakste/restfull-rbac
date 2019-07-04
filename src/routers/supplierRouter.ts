import express from 'express';
const router = express.Router();
import SupplierController from '../controllers/SupplierController';

router.get('/all', SupplierController.get_all_suppliers);
router.get('/one', SupplierController.get_one_suppliers);
router.patch('/one', SupplierController.patch_supplier);
router.post('/one', SupplierController.post_supplier);
router.delete('/one', SupplierController.delete_supplier);

export default router;