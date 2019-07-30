import puppeteer from 'puppeteer'

async function doWork(asin: string) {
  const url = 'https://sellercentral.amazon.com/hz/fba/profitabilitycalculator/index?lang=en_US';
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  await page.click('#search-string');
  await page.type('#search-string', asin)
  await page.click('#a-autoid-1 > span > input');
  await page.waitForSelector('#product-info-asin');

  await page.waitForFunction((ass) => {
    const input = document.querySelector('#product-info-asin')
      ? document.querySelector('#product-info-asin')
      : null;
    const data = input ? input.textContent : '';
    console.log('hellow 01', data);
    console.log('hellow 02', ass == data);
    return ass == data;
  }, {}, asin);


  await page.click('#mfn-pricing');
  await page.type('#mfn-pricing', '234');
  const pattern = 234;
  await page.waitForFunction((pat) => {
    const input: any = document.getElementById('mfn-pricing') ? document.getElementById('mfn-pricing') : null;
    console.log('hellow', input && input.value);
    const data = input ? input.value : '';
    console.log('hellow2', pat == data);
    return pat == data;
  }, {}, pattern);
  console.log('here we are!');
  await page.waitFor(3000);
  await page.click('#update-fees-link-announce');
  console.log('here we are! 2');
}

const asin = 'B06Y22V315'
doWork(asin);