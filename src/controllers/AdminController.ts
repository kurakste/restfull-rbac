import Users from '../model/users';
import Items from '../model/item';
import { userInfo } from 'os';
import apiDataObject from '../helpers/apiDataObject'; 

const controller = {
  
  get_all_users: (req: any, res: any, next: Function):void => {
    Users.find({
    })
    .exec()
    .then((data: any) => {
      const users = data.map( (_user: any) => {
        const { _id, name, role, rate, email, active } = _user;
        return { _id, name, role, rate, email, active };
      });
      return res.status(200).json(users);
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
  
  },
  /**
   * It gets parameters in json body.
   *  uid - user id, required;
   *  rate - user rates level;
   *  role - users role;
   *  active - active user or no.
   */
  patch_user: (req: any, res: any, next: Function):void => {
    console.log('input in patch: ', req.body);
    const uid = req.body._id;
    if (!uid) return res.status(400).json({
      message: 'We need user id as uid at least.'
    });
    console.log('active:');
    const name = req.body.name;
    const rate = parseFloat(req.body.rate);
    const role = parseInt(req.body.role);
    const active = req.body.active
    if (!(rate || role )) return res.status(400).json({
      message: 'We need user rate as rate or(and) user role as role.'
    });
  
    Users.findOne({
      _id: uid
    })
    .exec()
    .then((usr: any) => {
      if (!usr) return  res.status(404).json({
        message: `User _id: ${uid} was't found.`
      });
      if (rate) usr.rate = rate;
      if (role) usr.role = role;
      if (name) usr.name = name;
      usr.active = active;
      usr.save()
        .then( (result: any) =>{
          return res.status(200).json(result);
        });
    })
    .catch(err => {
      return res.status(500).json({
        error: err
      });
    });

  },

  delete_user: (req: any, res: any, next: Function):void => {
    const uid = req.body.uid;
    if (!uid) return res.status(400).json({
      message: 'We need user id as uid at least.'
    });
    
    Users.deleteOne({
      _id: uid
    })
    .exec()
    .then((result: any) => {
      console.log(result);
      if (result.deletedCount===0) {
        return res.status(404).json({
        message: `User with _id: ${uid} was not found.`
      });
      } 
      return res.status(200).json({
        message: `User with _id: ${uid} was deleted successfull.`
      });
    })
    .catch(err => {
      return res.status(500).json({
        error: err
      });
    });

  },
  
  get_all_checked_items: (req: any, res: any, next: Function):void => {
    Items.find({chekedby: {$ne: null}})
    .populate('createdby')
    .populate('chekedby')
    .exec()
    .then(data => {
      return res.status(200).json(apiDataObject(data, true));
    })
    .catch(err => {
      console.log(err)
      return res.status(200).json(apiDataObject(null, false, 'Api error'));
    });
  
  },
  
  get_all_free_items: (req: any, res: any, next: Function):void => {
    Items.find({chekedby: null})
    .populate('createdby')
    .exec()
    .then(data => {
      console.log(data);
      return res.status(200).json(apiDataObject(data, true));
    })
    .catch(err => {
      console.log(err)
      return res.status(200).json(apiDataObject(null, false, 'Api error :-('));
    });
  
  },

}
export default controller;