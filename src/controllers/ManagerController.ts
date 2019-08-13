import express from 'express';
import mongoose from 'mongoose';
import Item from '../model/item';
import getCurrentUser from '../helpers/getCurrentUser';
import amazonParser from '../console/logic/AmazonParser';
import sellcentrallParser from '../console/logic/SellCentrallParser'; 
import downloadimages from '../helpers/amazonDownloadImages';
import cl from '../helpers/debugMessageLoger';
import HttpErrorHandler from '../helpers/HttpErrorHandler';
import HttpSuccessHandler from '../helpers/HttpSuccessHandler';

const ps = (input: string): number => {
  const parsed = parseFloat(input);
  if (parsed !== parsed) return 0;
  return parsed;
}

const controller = {
  post_add_product: async (req: express.Request, res: express.Response)
    : Promise<void> => {
      const user = getCurrentUser(req);
      const { id, lamazon, lsupplier, bsr, fba, amazon, supplier,
        reffee, fbafee, delivery, icomment, images } = req.body;
      
    cl('parsed data: ', id);

    if (!id) HttpErrorHandler(res, 'add item', new Error('id is required'));

    const item = new Item({
      _id: mongoose.Types.ObjectId(),
      id, fba, lamazon, lsupplier, bsr, amazon, supplier,
      reffee, fbafee, delivery, icomment, images,
      createdat: Date(),
      createdby: user.userId
    });

    item
      .save()
      .then(data => HttpSuccessHandler(res, 'manager.post_add_product',data))
      .catch(err => HttpErrorHandler(res, 'post_add_items', err));
  },

  patch_product: async (req: express.Request, res: express.Response): Promise<void> => {
    cl('patch_item', req.body);
    const {
      _id, id, fba, lamazon, lsupplier, bsr, amazon,
      supplier, reffee, fbafee, delivery, profit,
      margin, icomment
    } = req.body;

    Item.findOne({ _id: _id })
      .then((item: any) => {
        item.id = id;
        item.fba = fba;
        item.lamazon = lamazon;
        item.lsupplier = lsupplier;
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
            HttpSuccessHandler(res, 'manager.patch_product', 'ok'); 
          });
      })
      .catch(err => {
        HttpErrorHandler(res, 'patch_item', err);
      });
  },

  delete_product: async (req: express.Request, res: express.Response): Promise<void> => {
    cl('delete_item', req.body);
    const {
      _id,
    } = req.body;

    Item.deleteOne({ _id: _id })
      .then((result: any) => {
        HttpSuccessHandler(res, 'manager.delete_product', result);
      })
      .catch(err => {
        HttpErrorHandler(res, 'delete_item', err);
      });
  },

  get_all_products: async (req: express.Request, res: express.Response): Promise<void> => {

    const user = getCurrentUser(req);
    Item.find({
      createdby: user.userId,
      paidat: null,
    })
      .populate('createdby')
      .populate('chekedby')
      .exec()
      .then(items => {
        HttpSuccessHandler(res, 'manager.get_all_products.items', items);
      })
      .catch(err => {
        HttpErrorHandler(res, 'get_all_items', err);
      });
  },

  get_check_product: (req: express.Request, res: express.Response): void => {
    const itemid = req.query.iid;
    Item.find({
      id: itemid,
    })
      .exec()
      .then(items => {
        if (items.length > 0) {
          HttpSuccessHandler(
            res, 'manager.get_all_products.items',
            { isExist: true }
          );
        } else {
          HttpSuccessHandler(
            res, 'manager.get_all_products.items',
            { isExist: false }
          );
        }
      })
      .catch(err => {
        HttpErrorHandler(res, 'get_check_item', err);
      });
  },

  get_parse_amazon: async (req: express.Request, res: express.Response, ): Promise<void> => {
    const id = req.query.id;
    amazonParser(id)
      .then(async data => {
        cl('succesfull parsed data for id: ', id);
        await downloadimages(data.images);
        HttpSuccessHandler(res, 'manager.get_parse_amazon', data);
      })
      .catch(error => {
        HttpErrorHandler(res, 'manager.get_parse_amazon', error)
      })
  },

  get_parse_sellercentral: async (req: express.Request, res: express.Response, ): Promise<void> => {
    const id = req.query.id;
    const price = parseFloat(req.query.price);
    console.log(`Get request for sellcentral assin: ${id} price: ${price}`)
    sellcentrallParser(id, price)
      .then(async data => {
        cl('succesfull parsed data for id: ', id);
        HttpSuccessHandler(res, 'manager.get_parse_sellcentral', data);
      })
      .catch(error => {
        HttpErrorHandler(res, 'manager.get_parse_sellcentral', error)
      })
  },

}

export default controller;