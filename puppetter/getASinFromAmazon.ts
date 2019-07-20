import puppeteer from 'puppeteer';
import fs from 'fs';
import urls from './amazonCatUrls';


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
    result = __arr.reduce((ac:string[], el:string[]) => ac.concat(el), []);
    browser.close();
    
  } catch (e) {
    console.log(e);
  }
  return result;
}

async function doWork(urls: string[]) {
  try {
    const prom_bundle = urls.map((url: string) => getAssinFromCat(url, 20));
    const res:string[][] = await Promise.all(prom_bundle);
    const _res:string[][] = Array.from(res);
    const flatted = _res.reduce((ac:string[], el:string[])=> ac.concat(el),[]);
    fs.writeFileSync('asin.json', JSON.stringify(flatted));
    console.log('Extracted codes: ', flatted.length);
  } catch (e) { console.log(e) };
}

doWork(urls);
