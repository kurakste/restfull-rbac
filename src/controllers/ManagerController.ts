import express from 'express';
import mongoose from 'mongoose';
import Item from '../model/item';
import Amazon from '../model/amazon';
import getCurrentUser from '../helpers/getCurrentUser';
import amazonParser from '../console/logic/AmazonParser';
import HttpErrorHandler from '../helpers/HttpErrorHandler';
import dm from '../helpers/debugMessageLoger';
import downloadimages from '../helpers/amazonDownloadImages';

const ps = (input: string): number => {
  const parsed = parseFloat(input);
  if (parsed !== parsed) return 0;
  return parsed;
}

const controller = {
  /**
   *  In body we have to gets this data: 
   *  { name, link1, link2, id, roi }
   *  */
  post_add_items: async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {
    const user = getCurrentUser(req);
    const {
      id, fba, lamazon, lsupplier, bsr, amazon, supplier,
      commission, delivery, profit, margin, icomment
    } = req.body;
    if (!id) res.status(406).json({
      message: "id- fields is required"
    });

    const item = new Item({
      _id: mongoose.Types.ObjectId(),
      id, fba, lamazon, lsupplier, bsr, amazon, supplier,
      commission, delivery, profit, margin, icomment,
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
    const {
      id, fba, lamazon, lsupplier, bsr, amazon,
      supplier, commission, delivery, profit,
      margin, icomment
    } = req.body;

    Item.findOne({ id: id })
      .then((item: any) => {
        item.id = id;
        item.fba = fba;
        item.lamazon = lamazon;
        item.lsupplier = lsupplier;
        item.bsr = ps(bsr);
        item.amazon = ps(amazon);
        item.supplier = ps(supplier);
        item.commission = ps(commission);
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

  get_all_items: async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {

    const user = getCurrentUser(req);
    Item.find({
      createdby: user.userId,
      paid_at: null,
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
  get_parse: async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {
    const id = req.query.id;
    const data = await amazonParser(id);
    if (data.title !== '') {
      try {
        await Amazon.findOne({ id: id }).remove().exec();
        const amazon = new Amazon({ _id: mongoose.Types.ObjectId(), ...data });
        const res = amazon.save();
        dm('get_parse', `save result is: ${res}`)
        downloadimages(data.images);
      } catch(error) {
        HttpErrorHandler(res, 'get_amazon_item', error)
      }
    }
    res.status(200).json({ message: 'Ok', data: data });
  },

  get_amazon_item: async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {
    const id = req.query.id;
    Amazon.findOne({ id: id })
      .exec()
      .then(data => {
        console.log('sending amazon string: ', data)
        res.status(200).json({ message: 'Ok', data: data });
      })
      .catch(error => {
        HttpErrorHandler(res, 'get_amazon_item', error)
      })
  },

}

export default controller;