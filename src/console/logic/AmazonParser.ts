import needle from 'needle';
import cheerio from 'cheerio';
import AmazonProductProfile from '../../interfaces/AmazonProfile';
const userAg = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.',
  'Mozilla/5.0 (X11; U; Linux Core i7-4980HQ; de; rv:32.0; compatible; JobboerseBot; http://www.jobboerse.com/bot.htm) Gecko/20100101 Firefox/38.0',
  'Mozilla/5.0 (X11; Linux i686; rv:21.0) Gecko/20100101 Firefox/21.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0',
];
const parseAmazonProduct = async (iid = 'B01HVI1C46') => {
  const url = 'https://www.amazon.com/dp/';
  const userAgIdx = Math.floor(Math.random() * (userAg.length-1));
  const getData = async () => {
    const opt = {
      headers: {
        'User-Agent': userAg[userAgIdx], 
      }
    };
    const product:AmazonProductProfile = { 
      id: iid, 
      images: [],
      title: '', 
      about: '',
      description: '',
      price: '',
      availability: '',
    }
    const data = await needle('get', url + iid, opt);
    const html = data.body;
    const $ = cheerio.load(html);
    const dp = $('#imageBlock_feature_div'); //('#dp');
    dp.find('img').each(function(this: any, i,e) {
      let link = $(this).attr('src');
      if (link.search('images/I/')!==-1) {
        link = link.split('/')[5];
        let imageid = (link.split('.')[0]) ? link.split('.')[0] : '';
        
        product.images.push(imageid);
      }
    });
    const pt = $('#productTitle');
    const title = pt.text().trim();
    product.title = title;
    const pa = $('#fbExpandableSectionContent > ul');
    let about = pa.text();
    about = about.replace(/\n/g, '');
    about = about.replace(/\t/g, '');
    about = about.replace(/\s{2,}/g, '');
    product.about = about;
    const pd = $('#productDescription');
    let desc = pd.text();
    desc = desc.replace(/\n/g, '');
    desc = desc.replace(/\t/g, '');
    desc = desc.replace(/\s{2,}/g, '');
    product.description = desc;
    const ppr = $('#priceblock_ourprice');
    let price = ppr.text();
    product.price = price;
    const pav = $('#availability-brief');
    let availability = pav.text();
    availability= availability.replace(/\n/g, '');
    availability = availability.replace(/\t/g, '');
    availability = availability.replace(/\s{2,}/g, '');
    product.availability = availability;
    return product;
  }
  const data = await getData()  
  return data;
}

export default parseAmazonProduct;