import Item from '../model/item';
import getCurrentUser from '../helpers/getCurrentUser';
import ItemStatus from '../interfaces/itemstatus';

const controller = {
  
  get_free: (req: any, res: any, next: Function):void => {
    const user = getCurrentUser(req); 
    console.log('get free user:', user);
    Item.find({
      checkedby: null,
      fba: {$eq: user.fba}
    })
    .exec()
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
  
  },
  
  get_my_items: (req: any, res: any, next: Function):void => {
    const user = getCurrentUser(req); 
    Item.find({
      checkedby: user.userId
    })
    .exec()
    .then(data => {
  //    console.log('Data from super: ', data);
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
  },

  patch_item: (req: any, res: any, next: Function):void => {
    //const user = getCurrentUser(req); 
    console.log('patch_item:', req.body);
    const {_id, status, checkednotes } = req.body;

    if ((status > 2) || (status < 0)) return res.status(200).json({
      result: false,
      message: "Only 0,1,2 code are allowed for suprvisor"
    });

    Item.findOne({_id: _id })
      .then((item: any) => {
        item.status = status;
        item.checkednotes = checkednotes;
        //item.status = status,
        item.checkedat = Date(); 
        item.save()
          .then((result: any) =>{
            console.log('patch result: ', result);
              return res.status(200).json({
                result: true,
                data: result,
              });
            });
          })
          .catch(err => {
            return res.status(500).json({
              result: false,
              message: "error in databese",
            });
      })
      .catch(err => {
        console.log(err);
      });
  },
  
  post_pickup_item: (req: any, res: any, next: Function):void => {
    const iid = req.body.iid;
    console.log('pickup:', iid);
    Item.findOne({
      _id: iid
    })
    .exec()
    .then((data: any) => {
      if (!data) return res.status(404).json({
           message: 'The item is not found.'
      });
      // Was the item picked up by another supervisor?
      // There is a time lag betwin moment when user gets list 
      // of items & when he will try to pick up an item. 
      if (data.checkedby) return res.status(200).json({
        result: false,
        message: 'The item was blocked by another user.'
      });

      const user = getCurrentUser(req); 
      data.checkedby = user.userId;
      data.save()
      .then((data: any) => {
        console.log('saved', data);
        return res.status(200).json({
          result: true,  
          data: data
        });
      })
      .catch((err: any) => {
        return res.status(200).json({
          result: false,
          message: 'dbase error.'
        });
      });
    });
  },
  post_change_status: (req: any, res: any, next: Function):void => {
    const user = getCurrentUser(req); 
    const iid = req.body.iid;
    if ((req.body.code > 2) || (req.body.code < 0)) return res.status(403).json({
      message: "Only 0,1,2 code are allowed for suprvisor"
    });
    const code: ItemStatus = req.body.code;
    if (!(iid && code)) return res.status(400).json({
      message: "Item id (iid) & status code are required."
    });
    const notes = req.body.notes || '';

    Item.findOne({
      _id: iid,
      chekedby: user.userId
    })
    .exec()
    .then((data: any) => { 
      data.checked_at = Date();
      data.status = code;
      data.checkednotes = notes;
      data.save()
        .then((result: any) => {
          return res.json(result);
        });
      })
    .catch((err:any) => {
      console.log('we in error brnch(')
      return res.status(500).json({
        error: err
      });
    });
  }
}

export default controller;