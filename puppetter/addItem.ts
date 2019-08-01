import puppeteer from 'puppeteer';

export default async function addItem(
    asin: string,
    user: { email: string, pass: string },
    url: string) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    //page.setDefaultNavigationTimeout(3000);
    //page.setDefaultTimeout(20000);
    try {
        // start auth
        await page.goto(url); //'localhost:3000/#/login');
        await page.click('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-3.input-group > input');
        await page.waitForSelector('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-3.input-group > input')
        await page.type('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-3.input-group > input', user.email);
        await page.click('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-4.input-group > input');
        await page.type('#root > div > div > div > div > div > div.p-4.card > div > form > div.mb-4.input-group > input', user.pass);
        await page.click('#root > div > div > div > div > div > div.p-4.card > div > form > div.row > div:nth-child(1) > button');
        //-end auth, goto add new item page
        await page.waitForSelector('#root > div > div > main > div.container-fluid > div > div > div > div > div.card-body > div > div:nth-child(1) > div > div.px-3.py-2.card-footer > a');
        await page.click('#root > div > div > main > div.container-fluid > div > div > div > div > div.card-body > div > div:nth-child(1) > div > div.px-3.py-2.card-footer > a');
        await page.waitForSelector('#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(4) > div > div > div');
        const el = await page.$('#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(4) > div > div > div');
        let text = await page.evaluate(el => el.textContent, el);
        // input asin
        await page.click('#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(2) > input');
        await page.type('#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(2) > input', asin);
        await page.click('#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(3) > div:nth-child(1) > button');
        await page.waitForFunction(() => {
            const sel = '#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(4) > div > div > div';
            const el: any = document.querySelector(sel);
            const cnt = el ? el.innerText.length : 0;
            return cnt == 27 || cnt == 38
        });
        //console.log('afrer await: ',asin);

        text = await page.evaluate(el => el.textContent, el);
        if (text.length == 27) {
            // we may add new element
            await page.click('#root > div > div > main > div.container-fluid > div > div:nth-child(1) > div.card-body > div:nth-child(3) > div:nth-child(2) > button');
            await page.waitForSelector('#root > div > div > main > div.container-fluid > div > div > div:nth-child(1) > div > div.card-header > button');
            const el = await page.$('#root > div > div > main > div.container-fluid > div > div > div:nth-child(1) > div > div.card-header > div');
            let text = await page.evaluate(el => el.textContent, el);
            await page.click('#root > div > div > main > div.container-fluid > div > div > div:nth-child(1) > div > div.card-header > button');
            //here we will wait for parsing data
            await page.waitForFunction(
                'document.querySelector("#root > div > div > main > div.container-fluid > div > div > div:nth-child(1) > div > div.card-header > div").innerText.length==61',
                {timeout: 4000}
                );
            text = await page.evaluate(el => el.textContent, el);
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
            //TODO: refactor this to more robust...
            await page.waitFor(100);

        } else if (text.length == 38) {
            //console.log('Element exist.');
            return {result: false, reason:'Element exist.', code: 1} 
        } else {
            //console.log('Somthing goes wrong...');
            return  {result: false, reason:'Somthing goes wrong..', code: 2} 
        }
        return {result: true, reason:'', code: 0} ;
        //browser.close()
    } catch (e) {
        //console.log(`error with ${asin}: `, e.message);
        return {result: false, reason: e.message, code: 3} 
    } finally {
        browser.close()
    }
};