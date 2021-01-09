import axios, { AxiosStatic, Canceler } from 'axios';
import { defaultOptions } from '../libs/defaults';
import { GreatAxiosConfig, GreatAxiosReqOption, ResponseHandle, BeforeSend, ErrorHandle } from '../libs/typings';
import { responseParse } from './response';
import { errorParse } from './error';
import { configDeepCopy } from './utils';

class GreatAxios {

  public axiosInstance: AxiosStatic;

  // defaults
  private options: GreatAxiosReqOption;

  private shortidInstance: any;
  private cancelTokenMap: Map<string, Canceler>;

  constructor(defaults?: GreatAxiosConfig) {
    const { reqConfig = {}, reqOptions } = configDeepCopy(defaults) || {};
    this.options = { ...defaultOptions, ...reqOptions };

    this.cancelTokenMap = new Map();

    this.shortidInstance = require('shortid'); // can not use import, fine -_-

    this.axiosInstance = axios;
    this.axiosInstance.defaults = reqConfig;
  }

  /**
   * 请求拦截器
   * @param {BeforeSend} beforeSend - 发起请求前的回调
   * @param {ErrorHandle} errorHandle - 请求错误的回调
   * @return {number}
  */
  public interceptors4Request(beforeSend: BeforeSend, errorHandle?: ErrorHandle): number {
    return this.interceptorsHandle('request', beforeSend, errorHandle);
  }
  
  /**
   * 响应拦截器
   * @param {ResponseHandle} ResponseHandle - 请求成功的回调
   * @param {ErrorHandle} errorHandle - 请求错误的回调
   * @return {number}
  */
  public interceptors4Response(responseHandle: ResponseHandle, errorHandle?: ErrorHandle): number {
    return this.interceptorsHandle('response', responseHandle, errorHandle);
  }

  private interceptorsHandle(type: string, firstHandle: any, secodeHandle?: ErrorHandle): number {
    return this.axiosInstance.interceptors[type].use((val: any) => {
      firstHandle(val);
      return val;
    }, (error: any) => {
      if (typeof secodeHandle === 'function') {
        secodeHandle(error);
      }
      return Promise.reject(error);
    });
  }

  /**
   * 移除拦截器
   * @param {number} interceptor
  */
  public removeInterceptor(interceptor: number): void {
    if (!interceptor) {
      console.error('require interceptor number');
      return;
    }
    this.axiosInstance.interceptors.request.eject(interceptor);
  }

  /**
   * jsonp请求
   * @param {string} url - 接口地址
   * @param {GreatAxiosConfig} config - （可选）请求配置
   * @return {Promise<any>}
  */
  public jsonp(url: string, config?: GreatAxiosConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      const { reqOptions = {} } = configDeepCopy(config) || {};
      const localOptions = { ...this.options, ...reqOptions};
      const { jsonpTimeout = 5000 } = localOptions;

      if (typeof process !== 'undefined') {
        // NODE ENV
        errorParse(localOptions, resolve, reject, null, 'can not run jsonp in nodejs');
        return;
      }

      const callbackName = `_jsp${(new Date()).getTime()}${Math.round(Math.random() * 1000)}`;
      const JSONP = document.createElement('script');
      JSONP.type = 'text/javascript';
      JSONP.src = `${url}&callback=${callbackName}`;
      let isSuccess = false;
      document.getElementsByTagName('head')[0].appendChild(JSONP);
      window[callbackName] = (rsp: any) => {
        isSuccess = true;
        const statusRsp = { data: rsp || {}, status: 200 };
        responseParse(statusRsp, localOptions, resolve, reject);
      };
      setTimeout(() => {
        document.getElementsByTagName('head')[0].removeChild(JSONP);
      }, 500);
      setTimeout(() => {
        if (!isSuccess) {
          const errorMsg = 'request timeout';
          errorParse(localOptions, resolve, reject, {
            response: {
              data: null,
              status: 408
            },
            message: errorMsg,
          }, errorMsg);
        }
      }, jsonpTimeout);
    });
  }

  /**
   * get请求
   * @param {string} url - 接口地址
   * @param {GreatAxiosConfig} config - （可选）请求配置
   * @return {Promise<any>}
  */
  public get(url: string, config?: GreatAxiosConfig): Promise<any> {
    const { reqConfig, reqOptions = {}, getInnerAttributes } = configDeepCopy(config) || {};
    const localOptions = { ...this.options, ...reqOptions};
    return new Promise((resolve, reject) => {

      const cancelId = this.shortidInstance.generate();
      const CancelToken = this.axiosInstance.CancelToken;
  
      this.axiosInstance.get(url, {
        cancelToken: new CancelToken((canceler: Canceler) => {
          this.cancelTokenMap.set(cancelId, canceler);
          if (typeof getInnerAttributes === 'function') {
            getInnerAttributes({
              cancelId,
              axiosInstance: this.axiosInstance,
            });
          }
        }),
        ...reqConfig
      }).then((rsp: any) => {
        responseParse(rsp, localOptions, resolve, reject);
      }).catch((err: any) => {
        errorParse(localOptions, resolve, reject, err);
      });
    });
  }

  /**
   * post请求
   * @param {string} url - 接口地址
   * @param {any} data - （可选）post参数
   * @param {GreatAxiosConfig} config - （可选）请求配置
   * @return {Promise<any>}
  */
  public post(url: string, data?: any, config?: GreatAxiosConfig): Promise<any> {
    const { reqConfig, reqOptions = {}, getInnerAttributes } = configDeepCopy(config) || {};
    const localOptions = { ...this.options, ...reqOptions};
    return new Promise((resolve, reject) => {

      const cancelId = this.shortidInstance.generate();
      const CancelToken = this.axiosInstance.CancelToken;

      this.axiosInstance.post(url, data, {
        cancelToken: new CancelToken(canceler => {
          this.cancelTokenMap.set(cancelId, canceler);
          if (typeof getInnerAttributes === 'function') {
            getInnerAttributes({
              cancelId,
              axiosInstance: this.axiosInstance,
            });
          }
        }),
        ...reqConfig
      }).then(rsp => {
        responseParse(rsp, localOptions, resolve, reject);
      }).catch(err => {
        errorParse(localOptions, resolve, reject, err);
      })
    });
  }

  /**
   * 中断请求
   * @param {string} cancelId - 请求id
  */
  public cancel(cancelId: string): void {
    if (!this.cancelTokenMap.has(cancelId)) {
      return;
    }
    const canceler = this.cancelTokenMap.get(cancelId);
    if (typeof canceler === 'function') {
      canceler();
      this.cancelTokenMap.delete(cancelId);
    }
  }
}

export default GreatAxios;
