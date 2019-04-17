/**
 * 1) Get all items that hase blank description field. 
 * 2) Parse product description from amazon.
 * 3) donload picture to the local storage
 * 4) Store propduc description in dbase 
 * 5) Strore desctiption record id in products table
 */

import bootstrap from '../bootstrap/bootstrap';
import parser from './logic/AmazonParser';
import Amazon from '../model/amazon';
import Items from '../model/item';
import mongoose from'mongoose';
import imagDownloader from './logic/imageDownloader';

const to = (promise:any) => {
  return promise.then((data:any) => {
     return [null, data];
  })
  .catch((err:any) => [err]);
}

async function asyncForEach(array:Array<any>, callback:CallableFunction) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
  
const downloadimages = async (items:any) => {
  if (!Array.isArray(items)) return;
  if (items.length === 0) return ;
  items.map((el:string) => {
    const elurl: string = el.replace('__', '%'); // i make this replacmente before
    imagDownloader(
        `https://images-na.ssl-images-amazon.com/images/I/${el}._SX1500_.jpg`,
        `./public/img/${el}.jpg`,
        () => console.log('Download done')
    )
  }); 
};

const  main =  async () => {
  let stored: any, forupdate:any, updated:any, amazon:any;
  let dbamazon: any;
  const db = bootstrap(); // Init dbase & env
  
  let [err, items] = await to(Items.find({amazondesc: null}));
  if (err) console.log(err);
  
  console.log(`We get ${(items)? items.length : ''} items. `);
  amazon = items.map(async (el:any) => {
      let [err,  amazonitm] = await to(parser(el.id)); 
      if (err) console.log(err);
      return amazonitm;
    });
  
  amazon = await Promise.all(amazon);
  amazon = amazon.filter((e:any) => e.title !== '')
  console.log('Get from amazon: ', amazon.length);
  
  const promBunch = amazon.map(async (el:any)=> {
    if(!Array.isArray(el.images)) return false;
    return downloadimages(el.images)  
  });

  await Promise.all(promBunch);

  const storeprom = amazon.map( (el:any) => {
    dbamazon = new Amazon(el);
    dbamazon._id = mongoose.Types.ObjectId();
    return dbamazon.save();
  });
  try {
    stored = await Promise.all(storeprom);
  } catch (e) {
    console.log(e);
  }

  forupdate = items.map((el:any) => {
    const id = el.id;
    const filtred = stored.filter((el:any) => el.id === id);
    if (filtred.length !== 0) {
      el.amazondesc = filtred[0]._id; 
      return el.save();
    } else {
      return null
    }
  });

  try {
    updated = await Promise.all(forupdate);
  } catch(e) {
    console.log(err);
  }

  db.disconnect();
} 

main();
