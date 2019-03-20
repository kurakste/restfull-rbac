import User from '../model/users';
import mongoose from 'mongoose';
import isUserExist from  '../helpers/isUserExist';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

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
    if (!req.body.password) return res.status(404).json({ message: 'Auth faild'});
    User.find({ email: req.body.email })
      .exec()
      .then((user:any) => {
        if (user.length < 1) {
          return res.status(404).json({
            message: 'Auth faild.'
          });
        }
        bcrypt.compare(req.body.password, user[0].password)
          .then(result => { 
            if (!process.env.JWT_KEY) throw new Error('JWT key not exist');
            if (result) {
              const token = jwt.sign(
                { 
                email: user[0].email,
                role: user[0].role,
                userId: user[0]._id
                }, 
                process.env.JWT_KEY,
                {expiresIn: "1h"}
              );
              return res.status(200).json({ authToken: token });
            } else {
              res.status(404).json({ message: 'Auth faild'});
            }
            console.log(result);
          })
          .catch(err => { 
            res.status(500).json({ error: err});
          });
      })
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
        // 'n' is amount string wich was affected.
        if (doc.n >= 1) {
          res.status(200).json({
            message: 'User was deleted'
          });
        } else {
          res.status(404).json({
            message: 'User not found.'
          });
        }
    })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      });
  },

};

export default controller;