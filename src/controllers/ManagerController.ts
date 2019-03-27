import Item from '../model/item';
import mongoose from 'mongoose';
import getCurrentUser from '../helpers/getCurrentUser';
import ItemStatus from '../interfaces/itemstatus';

const controller = {
  /**
   *  In body we have to gets this data: 
   *  { name, link1, link2, id, roi }
   *  */ 
  post_add_items: (req: any, res: any, next: Function):void => {
    const user = getCurrentUser(req); 
    console.log(req.body);
    const { name, link1, link2, id, roi } = req.body;
    if (!(name && id && roi)) return res.status(406).json({
      message: "name, id, roi - fields is required"
    });

    const item = new Item({
      _id: mongoose.Types.ObjectId(), 
      name, link1, link2, id, roi, 
      created_at: Date(),
      createdby: user.userId 
    });
    item
      .save()
      .then( data => {
        res.status(200).json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  },

  patch_item: (req: any, res: any, next: Function):void => {
    //const user = getCurrentUser(req); 
    const {_id, name, link1, link2, id, roi } = req.body;

    Item.findOne({_id: _id })
      .then((item: any) => {
        item.name = name;
        item.link1 = link1;
        item.link2 = link2;
        item.id = id;
        item.roi = parseFloat(roi);
        item.save()
          .then((result: any) =>{
              return res.status(200).json(result);
            });
          })
          .catch(err => {
            return res.status(500).json({
              error: err
            });
      })
      .catch(err => {
        console.log(err);
      });
  },

  get_all_items: (req: any, res: any, next: Function):void => {
    const user = getCurrentUser(req); 
    Item.find({
      createdby: user.userId  
    })
    .populate('users')
    .exec()
    .then(items => {
      console.log('items: ', items);
      return res.status(200).json(items);
    })
    .catch(err => {
      return res.status(500).json({
        error: err
      });
    });
  },
  get_check_item: (req: any, res: any, next: Function):void => {
    const itemid = req.query.iid;
    console.log(itemid);
    Item.find({
      id: itemid  
    })
    .exec()
    .then(items => {
      if (items.length > 0) {
        return res.status(200).json({
          isExist: true
        });
      } else {
        return res.status(200).json({
          isExist: false
        });
      }
    })
    .catch(err => {
        return res.status(200).json({
          isExist: false
        });
    });
  }
}

export default controller;