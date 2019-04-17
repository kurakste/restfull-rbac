import User from '../model/users';
import mongoose from 'mongoose';
import isUserExist from  '../helpers/isUserExist';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import apiDataObject from '../helpers/apiDataObject';
dotenv.config()

const controller = {
  
  //TODO: Why Express.Request not work with bodyParser???
  post_sign_up: (req: any, res: any, next: Function):void => {
    console.log('body:', req.body);
    const name: string = req.body.name;
    const email: string = req.body.email;
    const password: string|null = req.body.password;
    if (!(email && password)) return res
      .status(200).json(apiDataObject(null, false, 'Login & password are required.')) 
    
    // it will return ppromisies with flag in resolve function
    isUserExist(email)
     .then(flag => {
        if (!flag) { //user with such email doesn't exist.
          bcrypt.hash(password, 10)
            .then(hash => {
              const usr = new User({
                _id: mongoose.Types.ObjectId(),
                name: name,
                email: email,
                password: hash,
                active: true,
              });
              usr.save()
                .then((result:any) => {
                  result.password = null;
                  res.status(200).json(
                    apiDataObject(result)
                  );
                })
                .catch(err => {
                  res.status(200).json(
                    apiDataObject(null, false, 'Data base error')
                  );
                });
            })
          .catch(err => {
            return res.status(500).json(
                  apiDataObject(null, false, 'Data base error')
            );
          })
      } else {
        //user is exist
        res.status(200).json(
          apiDataObject(null, false, 'User with such email allredy exist.')
        );
      }
    }); 
  },

  post_sign_in: (req: any, res: any, next: any) => {
    if (!req.body.password) return res.status(404).json({ message: 'Auth faild'});
    console.log('login: ', req.body );
    User.find({ email: req.body.email })
      .exec()
      .then((user:any) => {
          if (user.length < 1) {
            return res.status(200).json({
              success: false,
              message: 'Auth faild.'
            });
          }
          if (!user[0].active) {
            return res.status(200).json({
              success: false,
              message: 'Auth faild.'
            });
          }
          bcrypt.compare(req.body.password, user[0].password)
            .then(result => { 
              if (!process.env.JWT_KEY) throw new Error('JWT key not exist');
              if (result) {
                console.log('from signin: ', user);
                const token = jwt.sign(
                  { 
                    email: user[0].email,
                    role: user[0].role,
                    userId: user[0]._id
                  }, 
                    process.env.JWT_KEY,
                    {expiresIn: "96h"}
                );
                return res.status(200).json({ 
                  success: true,
                  _id: user[0]._id,
                  name: user[0].email,
                  role: user[0].role,
                  authToken: token,
                });
              } else {
                return res.status(200).json({
                  success: false, 
                  message: 'Auth faild'
                });
              }
            })
            .catch(err => { 
              return res.status(500).json({ error: err});
            });
      })
      .catch(err => {
        console.log('catch', err);
        return res.status(500).json({ error: err});
      });
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
    const id = req.query.id;
    console.log('user id: ', id);
    User.find({ _id: id })
      .exec()
      .then((user: any) => {
        if (user.length) {
          user[0].password =null;
          res.status(200).json(user[0]);
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

  patch_one_user: (req: any, res: any, next: any) => {
    
    console.log('body from patch user: ', req.body);

    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    User.updateOne(
      { _id: id },
      {name: name, email: email}
    )
      .exec()
      .then((doc: any) => {
        // 'n' is amount string wich was affected.
        if (doc.n >= 1) {
          res.status(200).json({
            message: 'User was updated'
          });
        } else {
          res.status(200).json({
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