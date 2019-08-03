import needle from 'needle';
import tunnel from 'tunnel';
import getUserAgent from './getUserAgent';
import { getProxy } from './getProxy';

function getTunelAgent() {
  const tunnelingAgent = tunnel.httpsOverHttp({
    proxy: getProxy(),
  });
  return tunnelingAgent
}


async function getHtmlBody(url: string, proxy: boolean = false): Promise<string> {
  const _agent = proxy ? getTunelAgent() : false;
  const setting: needle.NeedleOptions = {
    headers: {
      'User-Agent': getUserAgent(),
    },
    agent: _agent
  }

  const response = await needle('get', url, setting);
  console.log('status code from getHtmlBody', response.statusCode);

  if (response.statusCode === 200) {
    return response.body;
  }

  if (response.statusCode === 302) {
    const rurl = response.headers.location ? response.headers.location : ''
    return await getHtmlBody(rurl);
  }

  return 'somthin goes wrong'
}

export default getHtmlBody;




