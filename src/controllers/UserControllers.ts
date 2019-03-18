import User from '../model/users';
import mongoose from 'mongoose';
import isUserExist from  '../helpers/isUserExist';
import bcrypt from 'bcrypt';

const controller = {
  
  //TODO: Why Express.Request not work with bodyParser???
  post_sign_up: (req: any, res: any, next: Function):void => {
    const email: string = req.body.email;
    const password: string|null = req.body.password;
    if (!(email && password)) res
      .status(400).json({ message: "Email & password required."}) 
    
    // it will return ppromisies with flag in resilve function
    isUserExist(email).then(flag => {
      if (!flag) { //user with such email doesn't exist.
        bcrypt.hash(password, 10)
          .then(hash => {
            const usr = new User({
              _id: mongoose.Types.ObjectId(),
              email: email,
              password: hash
            });
            usr.save()
              .then(result => {
                res.status(200).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
          })
          .catch(err => {
            return res.status(500).json({
              error: err
            });
          })
      } else {
        //user is exist
        res.status(409).json({
        message: 'User with such name already exist.'
        }) 
      }
    }); 
  },

  post_sign_in: (req: any, res: any, next: any) => {
    res.json({ message :'hi from user/post_sign_in' });
  },

  get_users_list: (req: any, res: any, next: any) => {
      User.find()
        .exec()
        .then(users => {
          if (users) {
            res.status(200).json(users);
          } else {
            res.status(404).json({ message: 'No valid users.'})
          } 
        })
        .catch( err => { 
          res.status(500).json({ erorr: err })
        });
  },

  get_one_user: (req: any, res: any, next: any) => {
    const id = req.body.id;
    User.find({ _id: id })
      .exec()
      .then((user: any) => {
        if (user.length) {
        res.status(200).json({
          user: user[0]
        });
        } else {
          res.status(404).json({
            message: "User not found."
          })
        }
    })
      .catch(err => {
        //TODO: Create error handler. Do not send error 500 in production server.
        res.status(500).json({
          error: err
        })
      });
  },

  del_one_user: (req: any, res: any, next: any) => {
    const id = req.body.id;
    User.remove({ _id: id })
      .exec()
      .then((doc: any) => {
        res.status(200).json({
          doc
        });
    })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      });
  },

};

export default controller;