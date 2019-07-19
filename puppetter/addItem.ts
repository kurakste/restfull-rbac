import puppeteer from 'puppeteer';

export default async function addItem(
  asin: string,
  user: { email: string, pass: string },
  url: string) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  try {
      await page.goto(url); //'localhost:3000/#/login');
      await page.click('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-3.input-group > input');
      await page.waitForSelector('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-3.input-group > input')
      await page.type('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-3.input-group > input', user.email);
      //await page.type('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-3.input-group > input', 'manager1@gmail.com' );
      await page.click('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-4.input-group > input');
      await page.type('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-4.input-group > input', user.pass);
      //await page.type('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-4.input-group > input', 'password');
      await page.click('#root > div > div > div > div > div > div.p-4.card > div > form > div.row > div:nth-child(1) > button');
      await page.waitForSelector('#root > div > div > main > div.container-fluid > div > div > div > div > div.card-body > div > div:nth-child(1) > div > div.px-3.py-2.card-footer > a');
      await page.click('#root > div > div > main > div.container-fluid > div > div > div > div > div.card-body > div > div:nth-child(1) > div > div.px-3.py-2.card-footer > a');
      await page.waitForSelector('#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(4) > div > div > div');
      const el = await page.$('#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(4) > div > div > div');
      let text = await page.evaluate(el => el.textContent, el);
      console.log(text);
      await page.click('#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(2) > input');
      await page.type('#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(2) > input', asin);
      console.log('asin: ', asin);
      await page.click('#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(3) > div:nth-child(1) > button');
      //await page.waitForFunction('document.querySelector("#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(4) > div > div > div").innerText.length==27');
      await page.waitForFunction(() => {
          const sel = '#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(4) > div > div > div';
          const el: any = document.querySelector(sel);
          const cnt = el ? el.innerText.length : 0;
          console.log('cnt=', cnt);
          return cnt == 27 || cnt == 38
      });

      //await page.waitFor(1000);
      text = await page.evaluate(el => el.textContent, el);
      console.log(text);
      console.log(text.length);
      if (text.length == 27) {
          await page.click('#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(3) > div:nth-child(2) > button');
          await page.waitForSelector('#root > div > div > main > div.container-fluid > div > div > div:nth-child(1) > div > div.card-header > button');
          const el = await page.$('#root > div > div > main > div.container-fluid > div > div > div:nth-child(1) > div > div.card-header > div');
          let text = await page.evaluate(el => el.textContent, el);
          console.log(text);
          console.log(text.length);
          await page.click('#root > div > div > main > div.container-fluid > div > div > div:nth-child(1) > div > div.card-header > button');
          await page.waitForFunction('document.querySelector("#root > div > div > main > div.container-fluid > div > div > div:nth-child(1) > div > div.card-header > div").innerText.length==61');
          text = await page.evaluate(el => el.textContent, el);
          console.log(text);
          console.log(text.length);
          await page.click('#fba');
          await page.waitForFunction(() => {
              let checkbox: any = document.querySelector('#fba');
              return checkbox ? checkbox.checked : false;
          });
          let sel = '#minpurchase'
          await page.click(sel);
          await page.type(sel, '1');
          sel = '#fbaamount';
          await page.click(sel);
          await page.type(sel, '1');
          sel = '#fbafee';
          await page.click(sel);
          await page.type(sel, '1');
          
          await page.click('#root > div > div > main > div.container-fluid > div > div > div:nth-child(1) > div > div.card-footer > button.btn.btn-primary.btn-sm');
          console.log('marker');

      } else if (text.length == 38) {
          console.log('Element exist.');
      } else {
          console.log('Somthing goes wrong...');
      }
      browser.close()
  } catch (e) {
      console.log('error: ', e);
      return;
  }
};