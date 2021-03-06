import express from 'express';
import Suppliers from '../model/suppliers';
import mongoose from 'mongoose';
import cl from '../helpers/debugMessageLoger';
import HttpErrorHandler from '../helpers/HttpErrorHandler';
import HttpSuccessHandler from '../helpers/HttpSuccessHandler';

const controller = {
  get_all_suppliers: (req: express.Request, res: express.Response): void => {
    const id = req.query.id;
    cl('controller.get_all_suppliers', req.query);
    Suppliers.find({
      id: id
    })
      .exec()
      .then((product: any) => {
        if (product) {
          HttpSuccessHandler(res, 'item.get_all_suppliers', product);
        } else {
          HttpErrorHandler(res, 'item.get_all_suppliers', new Error('Not foud'));
        }
      });

  },


  get_one_suppliers: (req: express.Request, res: express.Response): void => {
    const _id = req.query._id;
    cl('controller.get_all_suppliers', req.query);
    Suppliers.findOne({
      _id: _id
    })
      .exec()
      .then((product: any) => {
        if (product) {
          HttpSuccessHandler(res, 'item.get_all_suppliers', product);
        } else {
          HttpErrorHandler(res, 'item.get_all_suppliers', new Error('Not foud'));
        }
      });

  },

  patch_supplier: (req: express.Request, res: express.Response): void => {

    const supplier = req.body;
    console.log('===========>', supplier);

    Suppliers.findOne({ _id: supplier._id })
      .then((_supp: any) => {
        _supp.id = supplier.id;
        _supp.name = supplier.name;
        _supp.link = supplier.link;
        _supp.price = ps(supplier.price);
        _supp.delivery = ps(supplier.delivery);
        _supp.amount = ps(supplier.amount);
        _supp.minlot = ps(supplier.minlot);
        _supp.lotcost = ps(supplier.lotcost);
        _supp.comment = supplier.comment;

        _supp.save()
          .then((result: any) => {
            console.log('ok: ', result);
            HttpSuccessHandler(res, 'supplier.patch', 'ok');
          })
      })
      .catch(err => {
        HttpErrorHandler(res, 'patch_item', err);
      })
  },

  post_supplier: (req: express.Request, res: express.Response): void => {

    const supplier = req.body;
    const _supplier: any = {
      _id: mongoose.Types.ObjectId(),
      id: supplier.id,
      name: supplier.name,
      link: supplier.link,
      price: ps(supplier.price),
      delivery: ps(supplier.delivery),
      amount: ps(supplier.amount),
      minlot: ps(supplier.minlot),
      lotcost: ps(supplier.lotcost),
      comment: supplier.comment,
    };

    const supplierForSave = new Suppliers(_supplier);
    supplierForSave
      .save()
      .then((_sup: any) => {
        _sup.save()
          .then((result: any) => {
            console.log('ok: ', result);
            HttpSuccessHandler(res, 'supplier.post', 'ok');
          })
      })
      .catch(err => {
        HttpErrorHandler(res, 'supplier.post', err);
      })
  },

  delete_supplier: async (req: express.Request, res: express.Response): Promise<void> => {
    cl('delete_item', req.body);

    const _id = req.query._id;

    Suppliers.deleteOne({ _id: _id })
      .then((result: any) => {
        HttpSuccessHandler(res, 'suppliers.delete', result);
      })
      .catch(err => {
        HttpErrorHandler(res, 'supplier.delete', err);
      });
  },

}

function ps(input: string): number {
  const parsed = parseFloat(input);
  if (parsed !== parsed) return 0;
  return parsed;
}

export default controller;
