"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var defaults_1 = require("../libs/defaults");
var response_1 = require("./response");
var error_1 = require("./error");
var utils_1 = require("./utils");
var GreatAxios = /** @class */ (function () {
    function GreatAxios(defaults) {
        var _a = utils_1.configDeepCopy(defaults) || {}, _b = _a.reqConfig, reqConfig = _b === void 0 ? {} : _b, reqOptions = _a.reqOptions;
        this.options = __assign(__assign({}, defaults_1.defaultOptions), reqOptions);
        this.cancelTokenMap = new Map();
        this.shortidInstance = require('shortid'); // can not use import, fine -_-
        this.axiosInstance = axios_1.default;
        this.axiosInstance.defaults = reqConfig;
    }
    /**
     * 请求拦截器
     * @param {BeforeSend} beforeSend - 发起请求前的回调
     * @param {ErrorHandle} errorHandle - 请求错误的回调
     * @return {number}
    */
    GreatAxios.prototype.interceptors4Request = function (beforeSend, errorHandle) {
        return this.interceptorsHandle('request', beforeSend, errorHandle);
    };
    /**
     * 响应拦截器
     * @param {ResponseHandle} ResponseHandle - 请求成功的回调
     * @param {ErrorHandle} errorHandle - 请求错误的回调
     * @return {number}
    */
    GreatAxios.prototype.interceptors4Response = function (responseHandle, errorHandle) {
        return this.interceptorsHandle('response', responseHandle, errorHandle);
    };
    GreatAxios.prototype.interceptorsHandle = function (type, firstHandle, secodeHandle) {
        return this.axiosInstance.interceptors[type].use(function (val) {
            firstHandle(val);
            return val;
        }, function (error) {
            if (typeof secodeHandle === 'function') {
                secodeHandle(error);
            }
            return Promise.reject(error);
        });
    };
    /**
     * 移除拦截器
     * @param {number} interceptor
    */
    GreatAxios.prototype.removeInterceptor = function (interceptor) {
        if (!interceptor) {
            console.error('require interceptor number');
            return;
        }
        this.axiosInstance.interceptors.request.eject(interceptor);
    };
    /**
     * jsonp请求
     * @param {string} url - 接口地址
     * @param {GreatAxiosConfig} config - （可选）请求配置
     * @return {Promise<any>}
    */
    GreatAxios.prototype.jsonp = function (url, config) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a = (utils_1.configDeepCopy(config) || {}).reqOptions, reqOptions = _a === void 0 ? {} : _a;
            var localOptions = __assign(__assign({}, _this.options), reqOptions);
            var _b = localOptions.jsonpTimeout, jsonpTimeout = _b === void 0 ? 5000 : _b;
            if (typeof process !== 'undefined') {
                // NODE ENV
                error_1.errorParse(localOptions, resolve, reject, null, 'can not run jsonp in nodejs');
                return;
            }
            var callbackName = "_jsp" + (new Date()).getTime() + Math.round(Math.random() * 1000);
            var JSONP = document.createElement('script');
            JSONP.type = 'text/javascript';
            JSONP.src = url + "&callback=" + callbackName;
            var isSuccess = false;
            document.getElementsByTagName('head')[0].appendChild(JSONP);
            window[callbackName] = function (rsp) {
                isSuccess = true;
                var statusRsp = { data: rsp || {}, status: 200 };
                response_1.responseParse(statusRsp, localOptions, resolve, reject);
            };
            setTimeout(function () {
                document.getElementsByTagName('head')[0].removeChild(JSONP);
            }, 500);
            setTimeout(function () {
                if (!isSuccess) {
                    var errorMsg = 'request timeout';
                    error_1.errorParse(localOptions, resolve, reject, {
                        response: {
                            data: null,
                            status: 408
                        },
                        message: errorMsg,
                    }, errorMsg);
                }
            }, jsonpTimeout);
        });
    };
    /**
     * get请求
     * @param {string} url - 接口地址
     * @param {GreatAxiosConfig} config - （可选）请求配置
     * @return {Promise<any>}
    */
    GreatAxios.prototype.get = function (url, config) {
        var _this = this;
        var _a = utils_1.configDeepCopy(config) || {}, reqConfig = _a.reqConfig, _b = _a.reqOptions, reqOptions = _b === void 0 ? {} : _b, getInnerAttributes = _a.getInnerAttributes;
        var localOptions = __assign(__assign({}, this.options), reqOptions);
        return new Promise(function (resolve, reject) {
            var cancelId = _this.shortidInstance.generate();
            var CancelToken = _this.axiosInstance.CancelToken;
            _this.axiosInstance.get(url, __assign({ cancelToken: new CancelToken(function (canceler) {
                    _this.cancelTokenMap.set(cancelId, canceler);
                    if (typeof getInnerAttributes === 'function') {
                        getInnerAttributes({
                            cancelId: cancelId,
                            axiosInstance: _this.axiosInstance,
                        });
                    }
                }) }, reqConfig)).then(function (rsp) {
                response_1.responseParse(rsp, localOptions, resolve, reject);
            }).catch(function (err) {
                error_1.errorParse(localOptions, resolve, reject, err);
            });
        });
    };
    /**
     * post请求
     * @param {string} url - 接口地址
     * @param {any} data - （可选）post参数
     * @param {GreatAxiosConfig} config - （可选）请求配置
     * @return {Promise<any>}
    */
    GreatAxios.prototype.post = function (url, data, config) {
        var _this = this;
        var _a = utils_1.configDeepCopy(config) || {}, reqConfig = _a.reqConfig, _b = _a.reqOptions, reqOptions = _b === void 0 ? {} : _b, getInnerAttributes = _a.getInnerAttributes;
        var localOptions = __assign(__assign({}, this.options), reqOptions);
        return new Promise(function (resolve, reject) {
            var cancelId = _this.shortidInstance.generate();
            var CancelToken = _this.axiosInstance.CancelToken;
            _this.axiosInstance.post(url, data, __assign({ cancelToken: new CancelToken(function (canceler) {
                    _this.cancelTokenMap.set(cancelId, canceler);
                    if (typeof getInnerAttributes === 'function') {
                        getInnerAttributes({
                            cancelId: cancelId,
                            axiosInstance: _this.axiosInstance,
                        });
                    }
                }) }, reqConfig)).then(function (rsp) {
                response_1.responseParse(rsp, localOptions, resolve, reject);
            }).catch(function (err) {
                error_1.errorParse(localOptions, resolve, reject, err);
            });
        });
    };
    /**
     * 中断请求
     * @param {string} cancelId - 请求id
    */
    GreatAxios.prototype.cancel = function (cancelId) {
        if (!this.cancelTokenMap.has(cancelId)) {
            return;
        }
        var canceler = this.cancelTokenMap.get(cancelId);
        if (typeof canceler === 'function') {
            canceler();
            this.cancelTokenMap.delete(cancelId);
        }
    };
    return GreatAxios;
}());
exports.default = GreatAxios;
