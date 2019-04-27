import Item from '../model/item';
import Amazon from '../model/amazon';

import mongoose from 'mongoose';
import getCurrentUser from '../helpers/getCurrentUser';
import amazonParser from '../console/logic/AmazonParser';
import imagDownloader from '../console/logic/imageDownloader';
import HttpErrorHandler from '../helpers/HttpErrorHandler';

const downloadimages = async (items: any) => {
  if (!Array.isArray(items)) return;
  if (items.length === 0) return;
  items.map((el: string) => {
    const elurl: string = el.replace('__', '%'); // i make this replacmente before
    imagDownloader(
      `https://images-na.ssl-images-amazon.com/images/I/${elurl}._SX1500_.jpg`,
      `./public/img/${el}.jpg`,
      () => console.log('Download done')
    )
  });
};

const ps = (input: string): number => {
  const parsed = parseFloat(input);
  if (parsed!==parsed) return 0;
  return parsed;
}

const controller = {
  /**
   *  In body we have to gets this data: 
   *  { name, link1, link2, id, roi }
   *  */
  post_add_items: (req: any, res: any, next: Function): void => {
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
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  },

  patch_item: (req: any, res: any, next: Function): void => {
    //const user = getCurrentUser(req); 
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

  get_all_items: (req: any, res: any, next: Function): void => {
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

  get_check_item: (req: any, res: any, next: Function): void => {
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
  get_parse: async (req: any, res: any, next: Function) => {
    const id = req.query.id;
    console.log('parse item: ', id);
    const data = await amazonParser(id);
    if (data.title !== '') {
      await Amazon.findOne({ id: id }).remove().exec();
      const amazon = new Amazon({ _id: mongoose.Types.ObjectId(), ...data });
      const res = amazon.save();
      console.log('save res: ', res);
      downloadimages(data.images);
    }
    res.status(200).json({ message: 'Ok', data: data });
  },

  get_amazon_item: async (
    req: any,
    res: any,
    next: Function
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