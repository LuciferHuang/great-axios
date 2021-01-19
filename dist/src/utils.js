"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getError = exports.configDeepCopy = void 0;
/**
 * 配置项深拷贝
 * @param {any} obj - 配置对象
 * @return {GreatAxiosConfig}
*/
function configDeepCopy(obj) {
    var ignoreTypes = ['undefined', 'null'];
    // 直接返回值
    if (ignoreTypes.includes(typeof obj))
        return obj;
    // 拷贝其构造器，获取该对象的原型，使原型也继承下来
    var newObj = new obj.constructor();
    Object.keys(obj).forEach(function (key) {
        // 防止遍历时,拷贝到__proto__的可见属性
        if (obj.hasOwnProperty(key)) {
            var val = obj[key];
            newObj[key] = typeof val === 'object' ? configDeepCopy(val) : val;
        }
    });
    return newObj;
}
exports.configDeepCopy = configDeepCopy;
/**
 * @param {string} errorKey - 键名
 * @param {string} msg
 * @param {any} error
 * @return {GreatAxiosError}
*/
function getError(errorKey, msg, error) {
    var _a;
    if (msg === void 0) { msg = 'error'; }
    var defaultError = {
        message: msg,
        name: 'error',
        config: {},
        isAxiosError: false,
        toJSON: function () { return ({}); }
    };
    if (typeof error !== undefined) {
        defaultError = error;
    }
    return _a = {},
        _a[errorKey] = -1,
        _a.error = defaultError,
        _a.msg = msg,
        _a;
}
exports.getError = getError;
