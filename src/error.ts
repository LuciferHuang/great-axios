import { GreatAxiosReqOption, resolve, reject } from './types';
import { getError } from './utils';

/**
 * 错误处理
 * @param err
 * @param {GreatAxiosReqOption} options - GreatAxiosReqOption
 * @param {resolve} resolve - resolve
 * @param {reject} reject - reject
 */
export function errorParse(options: GreatAxiosReqOption, resolve: resolve, reject: reject, err?, msg?: string): void {
  const { ignoreStatus, errorKey, catchError } = options;
  let error = err;
  if (ignoreStatus && typeof errorKey === 'string') {
    error = getError(errorKey, msg, err);
  }
  if (catchError) {
    reject(error);
    return;
  }
  resolve(error);
}
