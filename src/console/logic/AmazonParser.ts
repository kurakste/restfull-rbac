import cheerio from 'cheerio';
import AmazonProductProfile from '../../interfaces/AmazonProfile';
import cl from '../../helpers/debugMessageLoger';
import getHtmlBody from '../getHtmlBody';

const cleaner = (input: string): string => {
  //input= input.replace(/\n/g, '');
  input = input.replace(/\t/g, '');
  input = input.replace(/\s{2,}/g, ' ');
  return input;
}

const parseAmazonProduct = async (iid = 'B01HVI1C46') => {
  cl('we parser iid:', iid);
  const url = 'https://www.amazon.com/dp/';

  const getData = async () => {
    
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
    const html = await getHtmlBody(url + iid, false);
    console.log('data: ', html);
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