import addItem from './addItem';
import { manager1 } from './users';
import fs from 'fs';

let asings: string[] = [];

const url = 'localhost:3000/#/login';

try {
  const rawdata = fs.readFileSync('./puppetter/getasin/asin.json');
  asings = JSON.parse(rawdata.toString());
  console.log(`I get array of asings with ${asings.length} item`);
} catch (e) {
  console.error(e);
}

const startPos = process.argv[2] ? parseInt(process.argv[2]) : 0;
const endPos = process.argv[3] ? parseInt(process.argv[3]) : 5;

const workArr = asings.slice(startPos, endPos + 1);

console.log(`Start adding ${workArr.length} items`);

const resolvers = workArr.map(async (el, i) => addItem(el, manager1, url));
