import parser from './logic/AmazonParser';
import imagDownloader from './logic/imageDownloader';

const input = [
  'B074HC94CJ',
  'B07GV5XBJV',
  'B01KSTNWV6',
  'B06Y3QXSGX',
  'B003TQPRGY', // don't work
  'B01IXFSJKQ', // doesnt ghave wight
  'B06XZTZ7GB',
];

const downloadimages = async (items:any) => {
  if (!Array.isArray(items)) return;
  if (items.length === 0) return ;
  items.map((el:string) => {
    const elurl: string = el.replace('__', '%'); // i make this replacmente before
    imagDownloader(
        `https://images-na.ssl-images-amazon.com/images/I/${elurl}._SX1500_.jpg`,
        `./public/img/${el}.jpg`,
        () => console.log('Download done')
    )
  }); 
};

const main = async () => {
  const data = await parser(input[6]);
  downloadimages(data.images);
  //console.log(data);
}

main();