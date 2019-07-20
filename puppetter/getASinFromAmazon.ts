import puppeteer from 'puppeteer';
import fs, { promises } from 'fs';

async function getArrayFromPage() {
  try { }
  catch (e) {

  }
}

async function getAsinFromPage(page: puppeteer.Page):Promise<string[]> {
  const asins: any[] = await page.evaluate(() => {
    const html = document.body.innerHTML;
    const rg = /\/dp\/\w+\//g;
    const tmp = html.match(rg);
    const _out = Array.from(new Set(tmp));
    const out = _out.map(el => el.split('/')[2]);
    return out;
  });

  return asins;
}

async function getAssinFromCat(url: string, pageAmount: number): Promise<string[]> {
  let result: string[] = [];
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const prom_bundel = [];

    for (let i = 1; i <= pageAmount; i++) {
      await page.goto(url + i);
      prom_bundel.push(getAsinFromPage(page));
    }
    const _arr:string[][]= await Promise.all(prom_bundel);
    const __arr:string[][] = Array.from(_arr);
    console.log('not flated:', _arr); // [['dddd','ddd'],[....
    console.log('is it array', Array.isArray(_arr)); // true
    //const result:any = [...__arr];
    const result:any[] = __arr.flat(); // :-(
    console.log('flated', result);
    //result = _arr.reduce((acc:any,el:any) => acc = [...acc, ...el], []); 
    //const __arr = [..._arr];
    //result = [...__arr];
    browser.close();
    
  } catch (e) {
    console.log(e);
  }
  return result;
}

async function doWork(urls: string[]) {
  try {
    const prom_bundle = urls.map((url: string) => getAssinFromCat(url, 2));
    const res:any = await Promise.all(prom_bundle);
    const result:Array<any> = res.flat();
    // res.forEach((element:Array<any>) => {
    //   result = [...result, ...element];
    // });
    fs.writeFileSync('asin.json', JSON.stringify(result));
    console.log(result.length);
  } catch (e) { console.log(e) };
}

const url: string[] = [
  'https://www.amazon.com/s?i=fashion-girls-intl-ship&bbn=16225020011&rh=n%3A7141123011%2Cn%3A16225020011%2Cn%3A1040664&lo=visual_grid&page=4&pf_rd_i=16225020011&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=3845f1c9-6308-47dc-a83f-d37bd1435a1a&pf_rd_r=6Q10K112S37VDSTJ8FVA&pf_rd_s=merchandised-search-2&pf_rd_t=101&qid=1563524916&ref=sr_pg_',
  'https://www.amazon.com/s?i=kitchen-intl-ship&bbn=16225011011&rh=n%3A16225011011%2Cn%3A284507&dc&page=2&fst=as%3Aoff&pf_rd_i=16225011011&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=710a58c3-24eb-4d05-9fcb-f0473b95be15&pf_rd_r=1N27D9C18KBNBH7QCES4&pf_rd_s=merchandised-search-3&pf_rd_t=101&qid=1563566693&rnid=16225011011&ref=sr_pg_',
  'https://www.amazon.com/s?i=kitchen-intl-ship&bbn=16225011011&rh=n%3A16225011011%2Cn%3A284507%2Cn%3A510136&dc&fst=as%3Aoff&pf_rd_i=16225011011&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=710a58c3-24eb-4d05-9fcb-f0473b95be15&pf_rd_r=1N27D9C18KBNBH7QCES4&pf_rd_s=merchandised-search-3&pf_rd_t=101&qid=1563566774&rnid=284507&ref=sr_pg_',
  'https://www.amazon.com/s?i=fashion-womens-intl-ship&bbn=16225018011&rh=n%3A7141123011%2Cn%3A16225018011%2Cn%3A2474936011&pf_rd_i=16225018011&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=5eee6234-a106-41bb-8652-b51ea2c1259c&pf_rd_r=SC97JMT3CEMX6V0AAG6D&pf_rd_s=merchandised-search-6&pf_rd_t=101&qid=1563566842&ref=sr_pg_',
  'https://www.amazon.com/s?i=fashion-womens-intl-ship&bbn=16225018011&rh=n%3A7141123011%2Cn%3A16225018011%2Cn%3A7581676011&pf_rd_i=16225018011&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=cebfdc4b-d51b-4fa9-8ec0-9dc14f9dd301&pf_rd_r=SC97JMT3CEMX6V0AAG6D&pf_rd_s=merchandised-search-8&pf_rd_t=101&qid=1563566879&ref=sr_pg_',
  'https://www.amazon.com/s?i=fashion-mens-intl-ship&bbn=16225019011&rh=n%3A7141123011%2Cn%3A16225019011%2Cn%3A7581682011&pf_rd_i=16225019011&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=3155590a-b6ee-46c3-8ccd-2e7db158dc36&pf_rd_r=G7HFD4HGP4PWX51ACG4B&pf_rd_s=merchandised-search-6&pf_rd_t=101&qid=1563566950&ref=sr_pg_',
  'https://www.amazon.com/s?i=sporting-intl-ship&bbn=16225014011&rh=n%3A16225014011%2Cn%3A10971181011&dc&fst=as%3Aoff&pf_rd_i=16225014011&pf_rd_m=ATVPDKIKX0DER&pf_rd_p=a3460e00-9eac-4cab-9814-093998a3f6d8&pf_rd_r=GTY4WCF85Z3D8W7WKET4&pf_rd_s=merchandised-search-4&pf_rd_t=101&qid=1563567004&rnid=16225014011&ref=sr_pg_'

];


doWork(url);
