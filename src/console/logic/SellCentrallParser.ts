import puppeteer from 'puppeteer';

interface IAmazonFeeAndDim {
  amazonFee: number;
  height: number,
  width: number,
  length: number,
  weight: number
}

function weightToKg(weight:number, units: string):number {
  let outWeight: number = 0;
  switch (units) {
    case 'pounds': 
      outWeight = weight * 0.453592; 
      break; 
    case 'ounces': 
      outWeight = weight * 0.0283495;
  }
  return outWeight;
}

export default async function (asin: string, price: number): Promise<IAmazonFeeAndDim | boolean> {
  const url = 'https://sellercentral.amazon.com/fba/profitabilitycalculator/index?lang=en_US';
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(url);
    await page.waitForSelector('#search-string');
    await page.click('#search-string');
    await page.type('#search-string', asin);
    await page.click('#a-autoid-1 > span > input');
    await page.waitForSelector('#update-fees-link-announce');
    await page.waitFor(1000);

    const length:number = await page.evaluate(() => {
      const el = document.querySelector('#product-info-length');
      return el ? parseFloat(el.innerHTML) : 0;
    });

    const width:number = await page.evaluate(() => {
      const el = document.querySelector('#product-info-width');
      return el ? parseFloat(el.innerHTML) : 0;
    });

    const height:number = await page.evaluate(() => {
      const el = document.querySelector('#product-info-height');
      return el ? parseFloat(el.innerHTML) : 0;
    });


    const _weight:number = await page.evaluate(() => {
      const el = document.querySelector('#product-info-weight');
      return el ? parseFloat(el.innerHTML) : 0;
    });

    const _weightUnint:string = await page.evaluate(() => {
      const el = document.querySelector('#product-info-weightunit');
      return el ? el.innerHTML : '';
    });

    const weight: number = weightToKg(_weight, _weightUnint); 

    console.log(`lenght: ${length}, width: ${width}, height: ${height}, wight: ${weight} kg`);


    await page.click('#afn-pricing');
    await page.type('#afn-pricing', price.toLocaleString())
    await page.waitFor(() => {
      const el = document.querySelector('#afn-pricing');
      const data = el ? (<HTMLInputElement>el).value : null;
      const res = data ? true : false
      return res;

    });

    await page.waitFor(1000);
    await page.click('#update-fees-link-announce');

    await page.waitFor(() => {
      const el = document.querySelector('#afn-amazon-fulfillment-fees');
      const data = el ? el.innerHTML : null;
      const res = data ? true : false
      return res;

    });

    const amazonFee:number = await page.evaluate(() => {
      const el = document.querySelector('#afn-amazon-fulfillment-fees');
      return el ? parseFloat(el.innerHTML) : 0;
    });

    return {
      amazonFee, length, width, height, weight   
    };
  } catch {

    return false;
  } finally {
    browser.close();
  }
}