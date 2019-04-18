import Item from '../model/item';
import mongoose from 'mongoose';
import getCurrentUser from '../helpers/getCurrentUser';

const controller = {
  /**
   *  In body we have to gets this data: 
   *  { name, link1, link2, id, roi }
   *  */ 
  post_add_items: (req: any, res: any, next: Function):void => {
    const user = getCurrentUser(req); 
    console.log(req.body);
    const { 
      id, fba, lamazon, lsupplier, bsr, amazon, supplier, 
      commission, delivery, profit, margin, icomment 
    } = req.body;
    if (!id) return res.status(406).json({
      message: "id- fields is required"
    });

    const item = new Item({
      _id: mongoose.Types.ObjectId(), 
      id, fba, lamazon, lsupplier, bsr, amazon, supplier, 
      commission, delivery, profit, margin, icomment, 
      createdat: Date(),
      createdby: user.userId 
    });

    console.log('adding new item', item);

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
    const {
      id, fba, lamazon, lsupplier, bsr, amazon,
      supplier, commission, delivery, profit,
      margin, icomment
    } = req.body;

    Item.findOne({id: id })
      .then((item: any) => {
        item.id = id; 
        item.fba = fba;
        item.lamazon = lamazon;
        item.lsupplier = lsupplier;
        item.bsr = parseFloat(bsr); 
        item.amazon = parseFloat(amazon);
        item.supplier =parseFloat(supplier); 
        item.commission = parseFloat(commission); 
        item.delivery = parseFloat(delivery);
        item.profit = parseFloat(profit);
        item.margin = parseFloat(margin);
        item.icomment = icomment;
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
      createdby: user.userId,
      paid_at: null,
    })
    .populate('users')
    .populate('chekedby')
    .exec()
    .then(items => {
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
    Item.find({
      id: itemid,  
      paid_at: null,
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
  },
}

export default controller;