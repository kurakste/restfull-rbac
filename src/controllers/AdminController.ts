import Item from '../model/item';
import Users from '../model/users';
import Items from '../model/item';

const controller = {
  
  get_all_users: (req: any, res: any, next: Function):void => {
    Users.find({
    })
    .exec()
    .then((data: any) => {
      const users = data.map( (_user: any) => {
        const { _id, role, rate, email } = _user;
        return { _id, role, rate, email};
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
   */
  patch_user: (req: any, res: any, next: Function):void => {
    const uid = req.body.uid;
    if (!uid) return res.status(400).json({
      message: 'We need user id as uid at least.'
    });
    const rate = parseFloat(req.body.rate);
    const role = parseInt(req.body.role);
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
  
  get_all_items: (req: any, res: any, next: Function):void => {
    Items.find({
    })
    .exec()
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
  
  },

}
export default controller;