import Item from '../model/item';
import getCurrentUser from '../helpers/getCurrentUser';
import ItemStatus from '../interfaces/itemstatus';
import cl from '../helpers/debugMessageLoger';
import HttpErrorHandler from '../helpers/HttpErrorHandler';
import HttpSuccessHandler from '../helpers/HttpSuccessHandler';

const controller = {

  get_free: (req: any, res: any, next: Function): void => {
    const user = getCurrentUser(req);
    cl('super.get_free:', user);
    let param;
    if (user.fba) {
      param = {
        //fba super get both fab & non fba items.
        checkedby: null,
      }
    } else {
      param = {
        checkedby: null,
        fba: { $eq: user.fba }
      }
    }
    Item.find(param)
      .exec()
      .then(data => {
        HttpSuccessHandler(res, 'superviser.get_free', data);
      })
      .catch(err => {
        HttpErrorHandler(res, 'Suprvisor.get_free', err);
      });

  },

  get_my_items: (req: any, res: any, next: Function): void => {
    const user = getCurrentUser(req);
    cl('supervisor.get_my_item: ', [22]);
    Item.find({
      checkedby: user.userId
    })
      .populate('createdby')
      .exec()
      .then(data => {
        HttpSuccessHandler(res, 'superviser.get_free', data);
      })
      .catch(err => {
        HttpErrorHandler(res, 'Suprvisor.get_my_item', err);
      });
  },

  patch_item: (req: any, res: any, next: Function): void => {
    //const user = getCurrentUser(req); 
    cl('supervisor.patch_item', req.body);
    const { _id, status, checkednotes } = req.body;

    if ((status > 5) || (status < 0)) HttpErrorHandler(
      res, 'Suprvisor.patch_item', new Error('Only 0,1,2,3,4,5 code are allowed for suprvisor')
    );

    Item.findOne({ _id: _id })
      .then((item: any) => {
        item.status = status;
        item.checkednotes = checkednotes;
        //item.status = status,
        item.checkedat = Date();
        item.save()
          .then((result: any) => {
            cl('supervisor.patch result: ', result);
            HttpSuccessHandler(res, 'superviser.patch_item', result);
          });
      })
      .catch(err => HttpErrorHandler(res, 'Suprvisor.patch_item', err));
  },

  post_pickup_item: (req: any, res: any, next: Function): void => {
    const iid = req.body.iid;
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
            HttpSuccessHandler(res, 'superviser.post_pickup_item', data);
          })
          .catch((err: any) => {
            HttpErrorHandler(res, 'Suprvisor.post_pickup_item', err);
          });
      });
  },
  
  // post_change_status: (req: any, res: any, next: Function): void => {
  //   const user = getCurrentUser(req);
  //   const iid = req.body.iid;
  //   if ((req.body.code > 2) || (req.body.code < 0)) return res.status(403).json({
  //     message: "Only 0,1,2 code are allowed for suprvisor"
  //   });
  //   const code: ItemStatus = req.body.code;
  //   if (!(iid && code)) return res.status(400).json({
  //     message: "Item id (iid) & status code are required."
  //   });
  //   const notes = req.body.notes || '';

  //   Item.findOne({
  //     _id: iid,
  //     chekedby: user.userId
  //   })
  //     .exec()
  //     .then((data: any) => {
  //       data.checked_at = Date();
  //       data.status = code;
  //       data.checkednotes = notes;
  //       data.save()
  //         .then((result: any) => {
  //           return res.json(result);
  //         });
  //     })
  //     .catch((err: any) => {
  //       HttpErrorHandler(res, 'Suprvisor.change_status', err);
  //     });
  // }
}

export default controller;