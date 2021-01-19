"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorParse = void 0;
var utils_1 = require("./utils");
/**
* 错误处理
* @param {any} err
* @param {GreatAxiosReqOption} options - GreatAxiosReqOption
* @param {resolve} resolve - resolve
* @param {reject} reject - reject
*/
function errorParse(options, resolve, reject, err, msg) {
    var ignoreStatus = options.ignoreStatus, errorKey = options.errorKey, catchError = options.catchError;
    var error = err;
    if (ignoreStatus && typeof errorKey === 'string') {
        error = utils_1.getError(errorKey, msg, err);
    }
    if (catchError) {
        reject(error);
        return;
    }
    resolve(error);
}
exports.errorParse = errorParse;
