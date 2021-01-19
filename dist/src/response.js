"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseParse = void 0;
var error_1 = require("./error");
/**
* 响应处理
* @param {any} rsp - 响应数据
* @param {GreatAxiosReqOption} options - GreatAxiosReqOption
* @param {resolve} resolve - resolve
* @param {reject} reject - reject
*/
function responseParse(rsp, options, resolve, reject) {
    var ignoreStatus = options.ignoreStatus, errorKey = options.errorKey;
    if (!ignoreStatus) {
        resolve(rsp);
        return;
    }
    if (!errorKey) {
        console.error('GreatAxios parse Error：missing errorKey');
        resolve(rsp);
        return;
    }
    var status = rsp.status, data = rsp.data;
    if (status === 200) {
        resolve(data);
        return;
    }
    error_1.errorParse(options, resolve, reject, null, "http error " + status);
}
exports.responseParse = responseParse;
