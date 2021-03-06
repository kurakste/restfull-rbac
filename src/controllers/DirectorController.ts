import Users from '../model/users';
import express from 'express';
import Items from '../model/item';
import apiDataObject from '../helpers/apiDataObject';
import getCurrentUser from '../helpers/getCurrentUser';
import cl from '../helpers/debugMessageLoger';
import HttpErrorHandler from '../helpers/HttpErrorHandler';
import HttpSuccessHandler from '../helpers/HttpSuccessHandler';

const ps = (input: string): number => {
  const parsed = parseFloat(input);
  if (parsed !== parsed) return 0;
  return parsed;
}

const controller = {

  get_vac_product: (req: express.Request, res: express.Response): void => {
    cl('director.get_vac_product');
    const user = getCurrentUser(req);
    let param;
    if (user.fba) {
      param = {
        //fba dir get both fab & non fba items.
        dircheckedby: null,
        status: { $in: [1, 2, 4] }
      }
    } else {
      param = {
        fba: false,
        dircheckedby: null,
        status: { $in: [1, 2, 4] }
      }
    }
    Items.find(param)
      .exec()
      .then(data => HttpSuccessHandler(res, 'director.get_vac_product', data))
      .catch(err => HttpErrorHandler(res, 'director.get_vac_product', err));
  },

  get_my_products: (req: express.Request, res: express.Response): void => {
    const user = getCurrentUser(req);
    cl('director.get_my_item: ');
    Items.find({
      dircheckedby: user.userId,
      paidat: null,
    })
      .populate('createdby')
      .populate('checkedby')
      .exec()
      .then(data => HttpSuccessHandler(res, 'director.get_my_products', data))
      .catch(err => HttpErrorHandler(res, 'get_my_product', err));
  },

  get_paid: (req: express.Request, res: express.Response): void => {
    const user = getCurrentUser(req);
    cl('directot.get_paid: ');
    Items.find({
      dircheckedby: user.userId,
      paidat: { $ne: null },
    })
      .populate('createdby')
      .exec()
      .then(data => HttpSuccessHandler(res, 'director.get_paid', data))
      .catch(err => HttpErrorHandler(res, 'get_my_product', err));
  },

  post_pickup_item: (req: express.Request, res: express.Response): void => {
    const iid = req.body.iid;
    cl('director.post_pickup_item', iid);
    Items.findOne({
      _id: iid
    })
      .exec()
      .then((data: any) => {
        if (!data) HttpErrorHandler(
          res, 'director.post_pickup_item',
          new Error('The item is not found.')
        );
        if (data.dircheckedby) HttpErrorHandler(
          res, 'director.post_pickup_item',
          new Error('The item was blocked by another user.')
        );

        const user = getCurrentUser(req);
        data.dircheckedby = user.userId;
        data.save()
          .then((data: any) => HttpSuccessHandler(
            res, 'director.get_vac_product', data)
          )
          .catch((err: any) => HttpErrorHandler(
            res, 'post_pickup_item', err)
          );
      });
  },

  patch_product: (req: express.Request, res: express.Response): void => {
    cl('director.patch_item:', req.body);
    const { _id, managerFine, managerFineComment, supervisorFine,
      supervisorFineComment, dirdecision,
    } = req.body;

    Items.findOne({ _id: _id })
      .then((item: any) => {
        item.dirdecision = ps(dirdecision);
        item.managerFine = ps(managerFine);
        item.managerFineComment = managerFineComment;
        item.supervisorFine = ps(supervisorFine);
        item.supervisorFineComment = supervisorFineComment;
        item.save()
          .then((data: any) => HttpSuccessHandler(res, 'director.patch_product', data))
      })
      .catch(err => HttpErrorHandler(res, 'director.patch_product', err));

  },

  post_make_payment: (req: express.Request, res: express.Response): void => {
    const ids = req.body.products;
    if (!Array.isArray(ids) || ids.length === 0) throw new Error('We needed array of _ids here');
    cl('direktor.make_payment', ids);

    Items.updateMany({ _id: { $in: ids } }, { paidat: Date() })
      .then(data => HttpSuccessHandler(res, 'director.post_make_payment', data))
      .catch(err => HttpErrorHandler(res, 'director.post_make_payment', err));
  },

  get_all_users: (req: any, res: any): void => {
    Users.find({
    })
      .exec()
      .then((data: any) => {
        const users = data.map((_user: any) => {
          //TODO: Is there more elegant way to remove password?
          const { _id, name, role, rate, email, fba, active } = _user;
          return { _id, name, role, rate, email, fba, active };
        });
        HttpSuccessHandler(res, 'director.get_all_users', users);
      })
      .catch(err => {
        HttpErrorHandler(res, 'director.get_all_users', err);
      });
  },

  patch_user: (req: express.Request, res: express.Response): void => {
    const uid = req.body._id;
    if (!uid) HttpErrorHandler(
      res, 'director.patch_user', new Error('We need user id as uid at least.')
    );

    const name = req.body.name;
    const rate = parseFloat(req.body.rate);
    const role = parseInt(req.body.role);
    const active = req.body.active
    const fba = req.body.fba
    if (!(rate || role)) res.status(400).json({
      message: 'We need user rate as rate or(and) user role as role.'
    });

    Users.findOne({
      _id: uid
    })
      .exec()
      .then((usr: any) => {
        if (!usr) return res.status(404).json({
          message: `User _id: ${uid} was't found.`
        });
        if (rate) usr.rate = rate;
        if (role) usr.role = role;
        if (name) usr.name = name;
        usr.fba = fba;
        usr.active = active;
        usr.save()
          .then((result: any) => HttpSuccessHandler(res, 'director.patch_user', result))
          .catch((err: any) => HttpErrorHandler(res, 'director.patch_user', err))
      });

  },

  /*
  get_all_checked_items: (req: express.Request, res: express.Response): void => {
    Items.find({
      checkedby: { $ne: null },
      paid_at: null,
    })
      .populate('createdby')
      .populate('checkedby')
      .exec()
      .then(data => {
        return res.status(200).json(apiDataObject(data, true));
      })
      .catch(err => {
        console.log(err)
        return res.status(200).json(apiDataObject(null, false, 'Api error'));
      });

  },

  get_all_free_items: (req: express.Request, res: express.Response): void => {
    Items.find({ checkedby: null })
      .populate('createdby')
      .exec()
      .then(data => {
        console.log(data);
        return res.status(200).json(apiDataObject(data, true));
      })
      .catch(err => {
        console.log(err)
        return res.status(200).json(apiDataObject(null, false, 'Api error :-('));
      });

  },


  patch_item: (req: express.Request, res: express.Response): void => {
    //const user = getCurrentUser(req); 
    console.log('manager patch_item:', req.body);
    const {
      _id, status, supervisorFine,
      supervisorFineComment, managerFine, managerFineComment
    } = req.body;

    Items.findOne({ _id: _id })
      .then((item: any) => {
        item.status = status;
        item.supervisorFineComment = supervisorFineComment;
        item.supervisorFine = supervisorFine;
        item.managerFine = managerFine;
        item.managerFineComment = managerFineComment;
        item.save()
          .then((result: any) => {
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
  
  pos_make_items_paid: (req: express.Request, res: express.Response): void => {
    console.log('We in the make items paid controller', req.body);
    if (
      (!req.body.payload) ||
      (!Array.isArray(req.body.payload)) ||
      (req.body.payload.length === 0)
    ) {
      res.status(200).json({
        success: true,
        message: 'It seems like array was empty.',
      });
    }

    Items.updateMany(
      { _id: { $in: req.body.payload } },
      { $set: { paid_at: Date() } }
    )
      .then((result) => {
        console.log('successfull result with db: ', result);
        return res.status(200).json({
          success: true,
          message: 'Hi, all was excelent!!!',
        });
      })
      .catch((err) => {
        console.log('db error happenes: ', err);
        return res.status(200).json({
          success: true,
          message: 'Some thing goes wrong....',
        });
      })

  },
  */

}
export default controller;