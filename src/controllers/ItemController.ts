import express from 'express';
import Items from '../model/item';
import mongoose from 'mongoose';
import cl from '../helpers/debugMessageLoger';
import HttpErrorHandler from '../helpers/HttpErrorHandler';
import HttpSuccessHandler from '../helpers/HttpSuccessHandler';
import getCurrentUser from '../helpers/getCurrentUser';

const controller = {
  get_product: (req: express.Request, res: express.Response): void => {
    const iid = req.query.id;
    cl('admin.get', iid);
    Items.findOne({
      _id: iid
    })
      .exec()
      .then((product: any) => {
        if (product) {
          HttpSuccessHandler(res, 'item.get_product', product);
        } else {
          HttpErrorHandler(res, 'item.get_product', new Error('Not foud'));
        }
      });

  },

  patch_product: (req: express.Request, res: express.Response): void => {

    const item = req.body;
    console.log('===========>', item);

    Items.findOne({ _id: item._id })
      .then((_item: any) => {
        _item.id = item.id;
        _item.lamazon = item.lamazon;
        _item.lsupplier = item.lsupplier;
        _item.fba = item.fba;
        _item.express = item.express;
        _item.minpurchase = ps(item.minpurchase);
        _item.bsr = ps(item.bsr);
        _item.amazon = ps(item.amazon);
        _item.weight = ps(item.weight);
        _item.supplier = ps(item.supplier);
        _item.fbalink = item.fbalink;
        _item.fbafee = ps(item.fbafee);
        _item.fbaamount = ps(item.fbaamount);
        _item.delivery = ps(item.delivery);
        _item.icomment = item.icomment;
        _item.status = ps(item.status);
        _item.checkednotes = item.checkednotes;
        _item.managerFine = ps(item.managerFine);
        _item.managerFineComment = item.managerFineComment;
        _item.supervisorFine = ps(item.supervisorFine);
        _item.supervisorFineComment = item.supervisorFineComment;
        _item.dirdecision = ps(item.dirdecision);
        _item.images = item.images;
        _item.checkedby = item.checkedby;
        _item.buyerscomment = item.buyerscomment;
        _item.amazonDescription = item.amazonDescription;
        _item.amazonDetail = item.amazonDetail;
        _item.amazonTitle = item.amazonTitle;

        if (item.checkedat) _item.checkedat = item.checkedat;

        _item.save()
          .then((result: any) => {
            console.log('ok: ', result);
            HttpSuccessHandler(res, 'item.patch_product', 'ok');
          })
      })
      .catch(err => {
        HttpErrorHandler(res, 'patch_item', err);
      })
  },

  post_product: (req: express.Request, res: express.Response): void => {

    const user = getCurrentUser(req);
    const item = req.body;
    const _item:any = {
      _id: mongoose.Types.ObjectId(),
      id: item.id,
      lamazon: item.lamazon,
      lsupplier: item.lsupplier,
      fba: item.fba,
      express: item.express,
      minpurchase: ps(item.minpurchase),
      bsr: ps(item.bsr),
      amazon: ps(item.amazon),
      weight: ps(item.weight),
      supplier: ps(item.supplier),
      fbalink: item.fbalink,
      fbafee: ps(item.fbafee),
      fbaamount: ps(item.fbaamount),
      delivery: ps(item.delivery),
      icomment: item.icomment,
      status: ps(item.status),
      checkednotes: item.checkednotes,
      managerFine: ps(item.managerFine),
      managerFineComment: item.managerFineComment,
      supervisorFine: ps(item.supervisorFine),
      supervisorFineComment: item.supervisorFineComment,
      dirdecision: ps(item.dirdecision),
      images: item.images,
      createdby: user.userId,
      createdat: Date(),
      amazonDescription: item.amazonDescription,
      amazonDetail: item.amazonDetail,
      amazonTitle: item.amazonTitle,
    };

    const itemForSave = new Items(_item);
    itemForSave
      .save()
      .then((_item: any) => {
        _item.save()
          .then((result: any) => {
            console.log('item was saved:', result.id);
            HttpSuccessHandler(res, 'item.post_product', 'ok');
          })
      })
      .catch(err => {
        HttpErrorHandler(res, 'patch_item', err);
      })
  },

  delete_product: async (req: express.Request, res: express.Response): Promise<void> => {
    cl('delete_item', req.body);
    
    const _id = req.query._id;

    Items.deleteOne({ _id: _id })
      .then((result: any) => {
        HttpSuccessHandler(res, 'manager.delete_product', result);
      })
      .catch(err => {
        HttpErrorHandler(res, 'delete_item', err);
      });
  },

}

export default controller;

function ps(input: string): number {
  const parsed = parseFloat(input);
  if (parsed !== parsed) return 0;
  return parsed;
}