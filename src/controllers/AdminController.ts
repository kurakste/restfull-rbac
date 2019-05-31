import Users from '../model/users';
import express from 'express';
import Items from '../model/item';
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
  get_notpaid_products: (req: express.Request, res: express.Response): void => {
    cl('admin.get_notpaid_product');

    Items.find({ paidat: null })
      .populate('createdby')
      .populate('checkedby')
      .exec()
      .then(data => HttpSuccessHandler(res, 'director.get_notpaid_products', data))
      .catch(err => HttpErrorHandler(res, 'director.get_notpaid_products', err));
  },

  get_waiting_products: (req: express.Request, res: express.Response): void => {
    cl('admin.get_waiting_product');

    Items.find({ status: 0 })
      .populate('createdby')
      .exec()
      .then(data => HttpSuccessHandler(res, 'director.get_paid', data))
      .catch(err => HttpErrorHandler(res, 'post_add_items', err));
  },

  get_vac_products: (req: express.Request, res: express.Response): void => {
    cl('admin.get_vac_product');
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
      .then(data => HttpSuccessHandler(res, 'director.get_vac_products', data))
      .catch(err => HttpErrorHandler(res, 'director.get_vac_products', err));
  },

  get_checking_products: (req: express.Request, res: express.Response): void => {
    const user = getCurrentUser(req);
    cl('admin.get_checking_item: ');
    Items.find({
      dircheckedby: { $ne: null },
      paidat: null,
    })
      .populate('createdby')
      .populate('dircheckedby')
      .exec()
      .then(data => HttpSuccessHandler(res, 'director.get_checking_products', data))
      .catch(err => HttpErrorHandler(res, 'director.get_checking_products', err));
  },

  get_paid: (req: express.Request, res: express.Response): void => {
    const user = getCurrentUser(req);
    cl('admin.get_paid!: ');
    Items.find({
      paidat: { $ne: null },
    })
      .populate('createdby')
      .populate('dircheckedby')
      .exec()
      .then(data => HttpSuccessHandler(res, 'director.get_paid', data))
      .catch(err => HttpErrorHandler(res, 'director.get_paid', err));
  },

  post_pickup_item: (req: express.Request, res: express.Response): void => {
    const iid = req.body.iid;
    cl('admin.post_pickup_item', iid);
    Items.findOne({
      _id: iid
    })
      .exec()
      .then((data: any) => {
        if (!data) return res.status(404).json({
          message: 'The item is not found.'
        });
        if (data.dircheckedby) return res.status(200).json({
          result: false,
          message: 'The item was blocked by another user.'
        });

        const user = getCurrentUser(req);
        data.dircheckedby = user.userId;
        data.save()
          .then((data: any)  => HttpSuccessHandler(res, 'director.post_pickup_item', data))
          .catch((err: any) => HttpErrorHandler(res, 'director.post_pickup_item', err));
      });
  },

  patch_product: (req: express.Request, res: express.Response): void => {
    cl('admin.patch_item:', req.body);
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
          .then((result: any) => {
            return res.status(200).json({
              result: true,
              data: result,
            });
          });
      })
      .catch(err => {
        HttpErrorHandler(res, 'dir_patch_product', err);
      })

  },

  post_make_payment: (req: express.Request, res: express.Response): void => {
    cl('admin.make_payment', req.body);
    const ids = req.body.products;
    if (!Array.isArray(ids) || ids.length === 0) throw new Error('We needed array of _ids here');
    cl('admin.make_payment', ids);


    Items.updateMany({ _id: { $in: ids } }, { paidat: Date() })
      .then((data: any)  => HttpSuccessHandler(res, 'director.post_make_payment', data))
      .catch((err: any) => HttpErrorHandler(res, 'director.post_make_payment', err));
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
        res.status(200).json(users);
      })
      .catch(err => {
        HttpErrorHandler(res, 'dir_get_all_users', err);
      });
  },

  patch_user: (req: express.Request, res: express.Response): void => {
    cl('Admin, input in patch: ', req.body);
    const uid = req.body._id;
    if (!uid) res.status(400).json({
      message: 'We need user id as uid at least.'
    });
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
          .then((result: any) => {
            return res.status(200).json(result);
          });
      })
      .catch(err => {
        HttpErrorHandler(res, 'dir_get_all_users', err);
      });

  },

  delete_user: (req: express.Request, res: express.Response): void => {
    const uid = req.body.uid;
    if (!uid) res.status(400).json({
      message: 'We need user id as uid at least.'
    });

    Users.deleteOne({
      _id: uid
    })
      .exec()
      .then((result: any) => {
        if (result.deletedCount === 0) {
          return res.status(404).json({
            message: `User with _id: ${uid} was not found.`
          });
        }
        return res.status(200).json({
          message: `User with _id: ${uid} was deleted successfull.`
        });
      })
      .catch(err => {
        HttpErrorHandler(res, 'dir_get_all_users', err);
      });

  },

}
export default controller;