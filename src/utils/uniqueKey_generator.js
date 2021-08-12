export default function createUniqueKey() {
  let dt = new Date().getTime();
  const tempStr = 'xxxxxx.yxyxxyxy.xxxyyy';
  const uuid = tempStr.replace(/[xy]/g, function(c) {
    /* eslint no-bitwise: 0 */
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    /* eslint no-bitwise: 0 */
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
