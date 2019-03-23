/**
 * Script for creating database.
 * 
 */

import faker from 'faker';
import User from '../src/model/users';
import Item from '../src/model/item';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { exists } from 'fs';


dotenv.config();


const url:any = (process.env.mongoDbLogin) ? 'mongodb+srv://' 
    + process.env.mongoDbLogin + ':' 
    + process.env.mongoDbPwd + '@' 
    + process.env.mongoDbHost 
    : 'mongodb://' + process.env.mongoDbHost;


mongoose
    .connect(
        url,
        { useNewUrlParser: true },
    )
    .catch(err => {
        console.log('Data base connection error. Check dbase string in .env');
        process.exit(0);
    });
// It fix deprication alerts.
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

async function getUsers() {
  return await User
    .find({ role: 3})
    .exec()
}

const createItems = async (amount: Number) => {
  console.log('hi1');
  try {
    const users = await getUsers()
    return users;
  } catch(e) {
    console.log(e);
  }
}


createItems(2)
  .then(data => {
    console.log(data);
    return data
  })
  .then(data => console.log(data))
