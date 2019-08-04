import { getProxyObject } from './getProxy';


test('is proxy object correct', () => {
  const correct = 'MKgcW6:hQ1vwo@196.19.179.233:8080';
  const result = getProxyObject(correct);
  expect((typeof(result)==='object')).toBe(true);

  expect(result.host).toBe('196.19.179.233');
  expect(result.port).toBe(8080);
  expect(result.proxyAuth).toBe('MKgcW6:hQ1vwo');

  const inCorrect = '196.19.179.233:8000';
  //expect(getProxyObject(inCorrect)).toThrowError('df');




});
