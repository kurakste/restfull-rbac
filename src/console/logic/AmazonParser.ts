import needle from 'needle';
import cheerio from 'cheerio';
import AmazonProductProfile from '../../interfaces/AmazonProfile';
import cl from '../../helpers/debugMessageLoger';
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

const cleaner = (input: string): string => {
  //input= input.replace(/\n/g, '');
  input = input.replace(/\t/g, '');
  input = input.replace(/\s{2,}/g, ' ');
  return input;
}

const parseAmazonProduct = async (iid = 'B01HVI1C46') => {
  cl('we parser iid:', iid);
  const url = 'https://www.amazon.com/dp/';
  const userAgIdx = Math.floor(Math.random() * (userAg.length - 1));
  const getData = async () => {
    const opt = {
      headers: {
        'User-Agent': userAg[userAgIdx],
      }
    };
    const product: AmazonProductProfile = {
      id: iid,
      images: [],
      title: '',
      about: '',
      description: '',
      price: '',
      availability: '',
      detail: '',
      asin: '',
      bsr: '',
      weight: 'NA',
    }
    const data = await needle('get', url + iid, opt);
    const html = data.body;
    const $ = cheerio.load(html);
    const dp = $('#imageBlock_feature_div'); //('#dp');
    dp.find('img').each(function (this: any, i, e) {
      let link = $(this).attr('src');

      if ((link.search('images/I/') !== -1) && (link.search('jpg')!==-1)) {
        link = link.split('/')[5];
        let imageid = (link.split('.')[0]) ? link.split('.')[0] : '';
        imageid = imageid.replace(/%/g, '_'); // we cant use % as a part of file path...
        product.images.push(imageid);
      }
    });
    const pt = $('#productTitle');
    const title = pt.text().trim();
    product.title = title;
    const pa = $('#fbExpandableSectionContent > ul');
    product.about = cleaner(pa.text());
    const pd = $('#productDescription');
    product.description = cleaner(pd.text());
    const ppr = $('#priceblock_ourprice');
    let price = ppr.text();
    product.price = price;
    const pav = $('#availability-brief');
    product.availability = cleaner(pav.text());

    const getProdDetail = ():string => {
      const markers = [
        '#prodDetails', '#descriptionAndDetails', '#productDetails',
        '#detail-bullets', '#detailBullets', '#productDetails_db_sections',
      ];
      const parsed = markers.map(el => {
        const pdet = $(el); //$('#detailBullets'); //('#productDetails_detailBullets_sections1');
        return product.detail = cleaner(pdet.text());
      })
      const reg = /ASIN:?\s*(\S+)/i 
      const filtered = parsed.filter(el => (el!=='' && el.match(reg)));
      return (filtered[0]) ? filtered[0] : '';
    }

    const getWight = (input:string):number|'NA' => {
      const reg = /shipping weight:?\s?(\d+.?\d*\s*\w+)?\s/i;

      const _res = input.match(reg);
      const res = _res ? _res[0].trim() : 'NA';
      const reg2 = /([0-9]+([.][0-9]*)?)/i;
      const _weight = res.match(reg2);
      const weight:number =_weight ? parseFloat(_weight[0]) : 0; 
      let result: number|'NA' = 'NA';
 
      if (res.split(' ')[3]==='pound' || res.split(' ')[3]==='pounds') {
        result = weight*0.453592;
        result = result ? result : 'NA';
      } else if (res.split(' ')[3]==='ounces' || res.split(' ')[3]==='ounce') {
        result = weight * 0.0283495;
        result = result ? result : 'NA';
      }
      
      return result;
    }

    const getASIN = (input:string):string => {
      const reg = /ASIN:?\s*(\S+)/i 
      const res = input.match(reg);
      return res ? res[1]: '';
    }
    const getBsr = (input:string):string => {
      const reg = /Best\s*Sellers\s*Rank\s*:?\s*#(\d+,?\d*)/i 
      const res = input.match(reg);
      return res ? res[1]: '';
    }

    product.detail = getProdDetail();
    product.asin = getASIN(product.detail);
    product.bsr = getBsr(product.detail);
    product.weight = getWight(product.detail);
    return product;
  }
  const data = await getData()
  return data;
}

export default parseAmazonProduct;