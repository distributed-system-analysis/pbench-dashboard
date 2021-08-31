export default function createUniqueKey() {
  const dt = new Date().getTime();
  const tempStr = 'xxxxxx.yxyxxyxy.xxxyyy';
  // eslint-disable-next-line func-names
  const uuid = tempStr.replace(/[xy]/g, function(c) {
    /* eslint no-bitwise: ["error", { "int32Hint": true }] */
    const r = ((dt + Math.random() * 16) & 0xf) | 0;
    /* eslint no-bitwise: ["error", { "allow": ["&", "|"] }] */
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
