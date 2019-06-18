import mongoose from 'mongoose';
import Istatus from '../interfaces/itemstatus';
import DirStatus from '../interfaces/dirstatus';

const itemSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  //name: { type: String, reqierd: true },
  // Введите номер товара Asin / получаем из ссылки на амазон
  id: { type: String, reqierd: true, unique: true, dropDups: true  },
  //is it usfull? 
  //amazondesc: { type: mongoose.Types.ObjectId, ref: 'amazon', reqierd: false },
  //Link for amazon
  lamazon: { type: String, reqierd: false },
  //Link for supplier
  lsupplier: { type: String, reqierd: false },
  //best sales rate from amazon
  bsr: { type: Number, reqierd: false },
  fba: { type: Boolean, default: false },
  minpurchase:{ type: Number, reqierd: false }, 
  //Buybox price. Price from amazon.
  amazon: { type: Number, reqierd: false },
  //Supplier price include delivery costs. 
  supplier: { type: Number, reqierd: false },
  //Referal fee, ammazon's commission. Only for no fba.
  reffee: { type: Number, reqierd: false },
  //Total fba fee = referal fee + fba fee). Only for fba.
  fbafee: { type: Number, reqierd: false },
  fbaamount:{ type: Number, reqierd: false }, 
  fbalink: { type: String, reqierd: false }, 
  //Delivery cost per one ps. 
  delivery: { type: Number, reqierd: false },
  //Calculated profit per one ps.
  // profit: { type: Number, reqierd: false },
  //Margin required only for non fba. Wish in fba.
  // margin: { type: Number, reqierd: false },
  //any comments from manager for this item.
  icomment: { type: String, reqierd: false },
  createdat: { type: Date, reqierd: true },
  createdby: { type: mongoose.Types.ObjectId, ref: 'users', reqierd: true },
//  checkedstate: { type: Number, reqierd: false },
  status: { type: Number, reqierd: false,default: Istatus.newitem },
  checkedby: { type: mongoose.Types.ObjectId, ref: 'users', reqierd: false },
  checkednotes: { type: String, reqierd: false },
  checkedat: { type: Date, reqierd: true },
  // Data whent the payment was made.
  managerFine: { type: Number, required: false},
  managerFineComment: { type: String, reqierd: false },
  supervisorFine: { type: Number, required: false},
  supervisorFineComment: { type: String, reqierd: false },
  dirdecision: { type: Number, reqierd: false, default: DirStatus.newitem },
  dircheckedby: { type: mongoose.Types.ObjectId, ref: 'users', reqierd: false },
  buyer: { type: mongoose.Types.ObjectId, ref: 'users', reqierd: false }, 
  buyerscomment: { type: String, reqierd: false },
  paidat: { type: Date, reqierd: false },
  //Who made this payment.
  paidby:  { type: mongoose.Types.ObjectId, ref: 'users', reqierd: false },
  images: { type: Array },
});

export default mongoose.model('items', itemSchema);