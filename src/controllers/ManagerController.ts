import express from 'express';
import mongoose from 'mongoose';
import Item from '../model/item';
//import Amazon from '../model/amazon';
import getCurrentUser from '../helpers/getCurrentUser';
import amazonParser from '../console/logic/AmazonParser';
import HttpErrorHandler from '../helpers/HttpErrorHandler';
import cl from '../helpers/debugMessageLoger';
import downloadimages from '../helpers/amazonDownloadImages';

const ps = (input: string): number => {
  const parsed = parseFloat(input);
  if (parsed !== parsed) return 0;
  return parsed;
}

const controller = {
  post_add_items: async (req: express.Request, res: express.Response)
    : Promise<void> => {
    const user = getCurrentUser(req);
    const { id, lamazon, lsupplier, bsr, fba, minpurchase,  amazon, supplier,
      reffee, fbafee, delivery, profit, margin, icomment, images } = req.body;
    
    if (!id) HttpErrorHandler(res, 'add item', new Error('id is required'));

    const item = new Item({
      _id: mongoose.Types.ObjectId(),
      id, fba, minpurchase, lamazon, lsupplier, bsr, amazon, supplier,
      reffee, fbafee, delivery, profit, margin, icomment, images,
      createdat: Date(),
      createdby: user.userId
    });

    item
      .save()
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        HttpErrorHandler(res, 'post_add_items', err);
      });
  },

  patch_item: async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {
    cl('patch_item', req.body);
    const {
      _id, id, fba, minpurchase, lamazon, lsupplier, bsr, amazon,
      supplier, reffee, fbafee, delivery, profit,
      margin, icomment
    } = req.body;

    Item.findOne({ _id: _id })
      .then((item: any) => {
        item.id = id;
        item.fba = fba;
        item.lamazon = lamazon;
        item.lsupplier = lsupplier;
        item.minpurchase = ps(minpurchase);
        item.bsr = ps(bsr);
        item.amazon = ps(amazon);
        item.supplier = ps(supplier);
        item.reffee = ps(reffee);
        item.fbafee = ps(fbafee);
        item.delivery = ps(delivery);
        item.profit = ps(profit);
        item.margin = ps(margin);
        item.icomment = icomment;
        item.save()
          .then((result: any) => {
            res.status(200).json(result);
          });
      })
      .catch(err => {
        HttpErrorHandler(res, 'patch_item', err);
      });
  },

  delete_item: async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {
    cl('delete_item', req.body);
    const {
      _id,
    } = req.body;

    Item.deleteOne({ _id: _id })
      .then((result: any) => {
        res.status(200).json(result);
      })
      .catch(err => {
        HttpErrorHandler(res, 'delete_item', err);
      });
  },

  get_all_items: async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {

    const user = getCurrentUser(req);
    Item.find({
      createdby: user.userId,
      paidat: null,
    })
      .populate('users')
      .populate('chekedby')
      .exec()
      .then(items => {
        res.status(200).json(items);
      })
      .catch(err => {
        HttpErrorHandler(res, 'get_all_items', err);
      });
  },

  get_check_item: async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {
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
        HttpErrorHandler(res, 'get_check_item', err);
      });
  },
  
  get_parse: async (req: express.Request, res: express.Response,): Promise<void> => {
    const id = req.query.id;
    amazonParser(id)
      .then(async data => {
        cl('parsed data: ', data);
        await downloadimages(data.images);
        res.status(200).json({ message: 'Ok', data: data });
      }) 
      .catch(error => {
        HttpErrorHandler(res, 'parse_amazon_item', error)
      })
  },

}

export default controller;