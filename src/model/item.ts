import mongoose from 'mongoose';
import Istatus from '../interfaces/itemstatus';

const itemSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String, reqierd: true },
  id: { 
      type: String, 
      reqierd: true, 
      unique: true,
      dropDups: true,
  },
  amazondesc: { type: mongoose.Types.ObjectId, ref: 'amazon', reqierd: false },
  lamazon: { type: String, reqierd: false },
  lsupplier: { type: String, reqierd: false },
  bsr: { type: Number, reqierd: false },
  amazon: { type: Number, reqierd: false },
  supplier: { type: Number, reqierd: false },
  commission: { type: Number, reqierd: false },
  delivery: { type: Number, reqierd: false },
  profit: { type: Number, reqierd: false },
  margin: { type: Number, reqierd: false },
  createdat: { type: Date, reqierd: true },
  icomment: { type: String, reqierd: false },
  createdby: { type: mongoose.Types.ObjectId, ref: 'users', reqierd: true },
  checkedstate: { type: Number, reqierd: false },
  checkedby: { type: mongoose.Types.ObjectId, ref: 'users', reqierd: false },
  checkednotes: { type: String, reqierd: false },
  checkedat: { type: Date, reqierd: true },
  status: { 
      type: Number, 
      reqierd: false,
      default: Istatus.newitem
    },
  paid_at: { type: Date, reqierd: false },
  managerFine: { type: Number, required: false},
  managerFineComment: { type: String, reqierd: false },
  supervisorFine: { type: Number, required: false},
  supervisorFineComment: { type: String, reqierd: false },

});

export default mongoose.model('items', itemSchema);