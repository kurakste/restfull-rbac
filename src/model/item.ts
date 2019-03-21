import mongoose from 'mongoose';
import Istatus from '../interfaces/itemstatus';

const itemSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: { type: String, reqierd: true },
  id: { 
      type: String, 
      reqierd: true, 
      unique: true
  },
  link1: { type: String, reqierd: false },
  link2: { type: String, reqierd: false },
  roi: { type: String, reqierd: false },
  created_at: { type: Date, reqierd: true },
  createdby: { type: mongoose.Types.ObjectId, reqierd: true },
  checkedstate: { type: Number, reqierd: false },
  chekedby: { type: mongoose.Types.ObjectId, reqierd: false },
  checkednotes: { type: String, reqierd: false },
  checked_at: { type: Date, reqierd: true },
  status: { 
      type: Number, 
      reqierd: false,
      default: Istatus.newitem
    },
  paid_at: { type: Date, reqierd: false },
});

export default mongoose.model('items', itemSchema);