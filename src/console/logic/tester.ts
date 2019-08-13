import getFee from './SellCentrallParser';

(async function(){
  const res = await getFee('B07FR8H9D5', 125.01);
  console.log(res);

})()