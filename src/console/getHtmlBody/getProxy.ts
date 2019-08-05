import proxyList from './proxyList';

interface ProxyObj {
  host: string,
  port: number,
  proxyAuth: string
};

function getProxyObject(input: string): ProxyObj {
  let auth, hostname, port;
  try {
    auth = input.split('@')[0];
    const ipWithPort = input.split('@')[1];
    hostname = ipWithPort.split(':')[0];
    port = parseInt(ipWithPort.split(':')[1]);
  } catch (e) {
    throw new Error(`Incorrect proxy string: ${input}`)
  }

  return { host: hostname, port: port, proxyAuth: auth }
}

function getProxy() {
  const proxyIdx = Math.floor(Math.random() * (proxyList.length));
  console.log(`used proxy: ${proxyList[proxyIdx]} `);
  return getProxyObject(proxyList[proxyIdx]);
}

export { getProxyObject, getProxy }
