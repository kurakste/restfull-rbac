import imagDownloader from '../console/logic/imageDownloader';
import cl from '../helpers/debugMessageLoger';

const downloadimages = async (items: any) => {
  if (!Array.isArray(items)) return;
  if (items.length === 0) return;
  const prombundle = items.map(async (el: string) => {
    const url:string = el.replace(/%/g, '_'); // can't use % to store in fs.
    return imagDownloader(
      `https://images-na.ssl-images-amazon.com/images/I/${url}._SX1500_.jpg`,
      `./public/img/${url}.jpg`,
      () => cl(`Downloding ./public/img/${el}.jpg is done`, url)
    )
  });
  await Promise.all(prombundle)
};

export default downloadimages;