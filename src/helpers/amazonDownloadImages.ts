import imagDownloader from '../console/logic/imageDownloader';

const downloadimages = async (items: any) => {
  if (!Array.isArray(items)) return;
  if (items.length === 0) return;
  items.map((el: string) => {
    const elurl: string = el.replace('__', '%'); // i make this replacmente before
    imagDownloader(
      `https://images-na.ssl-images-amazon.com/images/I/${elurl}._SX1500_.jpg`,
      `./public/img/${el}.jpg`,
      () => console.log('Download done')
    )
  });
};

export default downloadimages;