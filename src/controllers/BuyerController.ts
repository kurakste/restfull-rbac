import express from 'express';
import Items from '../model/item';
import ItemStatus from '../interfaces/itemstatus';
import getCurrentUser from '../helpers/getCurrentUser';
import cl from '../helpers/debugMessageLoger';
import HttpErrorHandler from '../helpers/HttpErrorHandler';

const ps = (input: string): number => {
  const parsed = parseFloat(input);
  if (parsed !== parsed) return 0;
  return parsed;
}

const controller = {

  get_free_products: (req: express.Request, res: express.Response): void => {
    Items.find({ status: ItemStatus.forfba, buyer: null })
      .exec()
      .then(data => {
        return res.status(200).json(data);
      })
      .catch(err => {
        return res.status(500).json({ error: err });
      });

  },

  get_products: (req: express.Request, res: express.Response): void => {
    const user = getCurrentUser(req);
    Items.find({ buyer: user.userId })
      .exec()
      .then(data => {
        return res.status(200).json(data);
      })
      .catch(err => {
        return res.status(500).json({ error: err });
      });

  },

  post_pickup_product: (req: express.Request, res: express.Response): void => {

    const iid = req.body.iid;
    cl('pickup:', iid);
    Items.findOne({
      _id: iid
    })
      .exec()
      .then((data: any) => {
        if (!data) return res.status(404).json({
          message: 'The item is not found.'
        });
        // Was the item picked up by another buyer?
        // There is a time lag betwin moment when user gets list 
        // of items & when he will try to pick up an item. 
        if (data.buyer) return res.status(200).json({
          result: false,
          message: 'The item was blocked by another buyer.'
        });

        const user = getCurrentUser(req);
        data.buyer = user.userId;
        data.save()
          .then((data: any) => {
            cl('buyer.pickup.saved', data);
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

  patch_product: async (req: express.Request, res: express.Response): Promise<void> => {
    const {
      _id, lsupplier, amazon, supplier, fbafee, delivery, profit, margin,
      buyerscomment, status, fbaamount, fbalink,
    } = req.body;
    
    cl('buyer.patch_item', [req.body, ps(status)]);
    Items.findOne({ _id: _id })
      .then((item: any) => {
        item.lsupplier = lsupplier;
        item.status = ps(status);
        item.amazon = ps(amazon);
        item.supplier = ps(supplier);
        item.fbafee = ps(fbafee);
        item.delivery = ps(delivery);
        item.profit = ps(profit);
        item.margin = ps(margin);
        item.fbaamount =ps(fbaamount);
        item.buyerscomment = buyerscomment;
        item.fbalink = fbalink;
        item.save()
          .then((result: any) => {
            res.status(200).json(result);
          });
      })
      .catch(err => {
        HttpErrorHandler(res, 'patch_item', err);
      });
  },

}

export default controller;