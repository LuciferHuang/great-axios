import { GreatAxiosReqOption, resolve, reject } from "../libs/typings";
import { getError } from "./utils";

/**
* 错误处理
* @param {any} err
* @param {GreatAxiosReqOption} options - GreatAxiosReqOption
* @param {resolve} resolve - resolve
* @param {reject} reject - reject
*/
export function errorParse(options: GreatAxiosReqOption, resolve: resolve, reject: reject, err?: any, msg?: string): void {
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