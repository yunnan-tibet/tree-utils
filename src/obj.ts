/**
 * 深拷贝
 * @param {any} obj
 * @returns {any} 深拷贝的对象
 */
export const deepClone = (obj: any) => {
  if (obj === null) return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (typeof obj !== 'object') return obj;
  const cloneObj = new obj.constructor();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 实现一个递归拷贝
      cloneObj[key] = deepClone(obj[key]);
    }
  }
  return cloneObj;
};

/**
 * 获取obj连锁key值的value
 * @param obj 
 * @param key 
 */
export const getChainKeysValue = (obj: any, key: string) => {
  if (!obj || !key || typeof key !== 'string' || !(obj instanceof Object)) {
    return null
  }
  const keyL = key.split('.');
  let _v = obj;
  for (let i = 0; i < keyL.length; i++) {
    if (!_v) {
      _v = null
      break;
    }
    _v = _v[keyL[i]];
  }
  return _v
}