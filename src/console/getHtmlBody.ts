import needle from 'needle';
import cheerio from 'cheerio';
import tunnel from 'tunnel';

function getProxy(){
  const tunnelingAgent = tunnel.httpsOverHttp({
    proxy: {
      host: '51.79.26.40',
      port: 8080,
    }
  });
  return tunnelingAgent
}

function getUserAgent() {
  const userAg: string[] = [
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
  const userAgIdx = Math.floor(Math.random() * (userAg.length - 1));

  return userAg[userAgIdx]
}

async function getHtmlBody(url: string, proxy: boolean = false): Promise<string | null> {
  const _agent = proxy ? getProxy() : false;
  const setting: needle.NeedleOptions = {
    headers: {
      'User-Agent': getUserAgent(),
    },
    agent: _agent
  }

  const response = await needle('get', url, setting);
  console.log(response.statusCode);

  if (response.statusCode === 200) {
    return response.body;
  }

  if (response.statusCode === 302) {
    const rurl = response.headers.location ? response.headers.location : ''
    return await getHtmlBody(rurl);
  }

  return 'somthin goes wrong'
}
(async function () {
  const res = await getHtmlBody('https://www.amazon.com/', true);
  const html = res ? res : 'Something goes wrong...';
  const $ = cheerio.load(html);
  const dp = $('#glow-ingress-line2'); //('#dp');
  console.log(dp.text());
})();

