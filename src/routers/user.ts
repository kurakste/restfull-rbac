import express from 'express';
const router = express.Router();
import UserController from '../controllers/UserControllers';

router.post('/signup', UserController.post_sign_up);
router.post('/signin', UserController.post_sign_in);
router.get('/list', UserController.get_users_list);
router.get('/one', UserController.get_one_user);
router.delete('/one', UserController.del_one_user);

export default router;