import imagDownloader from '../console/logic/imageDownloader';
import cl from '../helpers/debugMessageLoger';

const downloadimages = async (items: any) => {
  if (!Array.isArray(items)) return;
  if (items.length === 0) return;
  const prombundle = items.map(async (el: string) => {
    const elurl: string = el.replace('__', '%'); // i make this replacmente before
    return imagDownloader(
      `https://images-na.ssl-images-amazon.com/images/I/${elurl}._SX1500_.jpg`,
      `./public/img/${el}.jpg`,
      () => cl(`Downloding ./public/img/${el}.jpg is done`)
    )
  });
  await Promise.all(prombundle)
};

export default downloadimages;