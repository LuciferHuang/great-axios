import { GreatAxiosConfig, GreatAxiosError } from './types';

/**
 * 配置项深拷贝
 * @param obj - 配置对象
 * @return {GreatAxiosConfig}
 */
export function configDeepCopy(obj): GreatAxiosConfig {
  const ignoreTypes = ['undefined', 'null'];

  // 直接返回值
  if (ignoreTypes.includes(typeof obj)) return obj;

  // 拷贝其构造器，获取该对象的原型，使原型也继承下来
  const newObj = new obj.constructor();

  Object.keys(obj).forEach((key) => {
    // 防止遍历时,拷贝到__proto__的可见属性
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      newObj[key] = typeof val === 'object' ? configDeepCopy(val) : val;
    }
  });

  return newObj;
}

/**
 * @param {string} errorKey - 键名
 * @param {string} msg
 * @param error
 * @return {GreatAxiosError}
 */
export function getError(errorKey: string, msg = 'error', error?): GreatAxiosError {
  let defaultError = {
    message: msg,
    name: 'error',
    config: {},
    isAxiosError: false,
    toJSON: () => ({})
  };
  if (typeof error !== undefined) {
    defaultError = error;
  }
  return {
    [errorKey]: -1,
    error: defaultError,
    msg
  };
}
