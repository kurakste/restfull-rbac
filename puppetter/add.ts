import addItem from './addItem';
import { manager1, manag1_host } from './users';
import fs from 'fs';

let asings: string[] = [];

//const url = 'localhost:3000/#/login';
const url = 'https://www.kurakste.ru/#/login';
const user = manag1_host;

try {
  const rawdata = fs.readFileSync('./puppetter/getasin/asin.json');
  const tmp:string[] = JSON.parse(rawdata.toString());
  console.log(`I get array of asings with ${tmp.length} items`);
  asings = [...new Set(tmp)];
  console.log(`Uniq ${asings.length} items`);
  
} catch (e) {
  console.error(e);
}

const startPos = process.argv[2] ? parseInt(process.argv[2]) : 0;
const endPos = process.argv[3] ? parseInt(process.argv[3]) : 5;

const workArr = asings.slice(startPos, endPos + 1);

(async function() {
  const secondTry: string[] = [];
  console.log(`Start adding ${workArr.length} items`);
  for (let i = 0; i < workArr.length; i++) {
    const el = workArr[i];
    const out:{result:boolean, code: number, reason: string} = await addItem(el, user, url);
    if (!out.result && out.code===3) {
      secondTry.push(el);
    }
    console.log(`Done element (${i} of ${workArr.length}): ${el} with result ${out.result}, ${out.reason}`);
  }

  for (let i = 0; i < secondTry.length; i++) {
    const el = secondTry[i];
    const out:{result:boolean, code: number, reason: string} = await addItem(el, user, url);
    console.log(`Done element: ${el} with result ${out.result}, ${out.reason}`);
  }

})();
