import express from 'express';
const router = express.Router();
import SupplierController from '../controllers/SupplierController';

router.get('/', SupplierController.get_all_suppliers);
router.patch('/', SupplierController.patch_supplier);
router.post('/', SupplierController.post_supplier);
router.delete('/', SupplierController.delete_supplier);

export default router;