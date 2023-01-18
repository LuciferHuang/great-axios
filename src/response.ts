import { GreatAxiosReqOption, resolve, reject } from './types';
import { errorParse } from './error';

/**
 * 响应处理
 * @param rsp - 响应数据
 * @param {GreatAxiosReqOption} options - GreatAxiosReqOption
 * @param {resolve} resolve - resolve
 * @param {reject} reject - reject
 */
export function responseParse(rsp, options: GreatAxiosReqOption, resolve: resolve, reject: reject): void {
  const { ignoreStatus, errorKey } = options;
  if (!ignoreStatus) {
    resolve(rsp);
    return;
  }
  if (!errorKey) {
    console.error('GreatAxios parse Error：missing errorKey');
    resolve(rsp);
    return;
  }
  const { status, data } = rsp;
  if (status === 200) {
    resolve(data);
    return;
  }
  errorParse(options, resolve, reject, null, `http error ${status}`);
}
