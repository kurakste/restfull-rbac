import getFee from './SellCentrallParser';

(async function(){
  const res = await getFee('B073XC3Y5J', 125.01);
  console.log(res);

})()