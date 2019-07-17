import puppeteer from 'puppeteer';

(async ()=> {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.kurakste.ru/#/login');
    await page.click('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-3.input-group > input');
    await page.type('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-3.input-group > input', 'manager1@gmail.com' );
    await page.click('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-4.input-group > input');
    await page.type('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-4.input-group > input', 'password');
    await page.click('#root > div > div > div > div > div > div.p-4.card > div > form > div.row > div:nth-child(1) > button');
    await page.screenshot({path: 'example.png'});

  
})();