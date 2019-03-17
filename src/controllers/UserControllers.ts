import mongoose from 'mongoose';
import User from '../model/users';

const controller = {
  post_sign_up: (req: any, res: any, next: any) => {
    res.json('hi from user/post_sign_on');
  },

  post_sign_in: (req: any, res: any, next: any) => {
    res.json({ message :'hi from user/post_sign_in' });
  },

  post_sign_out: (req: any, res: any, next: any) => {
    res.json({ message: 'hi from user/post_sign_out' });
  },

  get_users_list: (req: any, res: any, next: any) => {
    res.json({ message: 'hi from user/get_users_list' });
  },

  get_one_user: (req: any, res: any, next: any) => {
    const email = req.body.email;
    User.find({ email: email })
      .exec()
      .then(user => res.json({
          user: user
        })
      )
      .catch(err => console.log(err))
    ;
  },

  del_one_user: (req: any, res: any, next: any) => {
    res.json({ message: 'hi from user/del_one_user'});
  },

  patch_one_user: (req: any, res: any, next: any) => {
    res.json({ message:'hi from user/patch_one_user' });
  },

  put_one_user: (req: any, res: any, next: any) => {
    res.json({ message: 'hi from user/put_one_user' });
  },
};

export default controller;