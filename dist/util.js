"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandUuid = exports.cleanUuid = exports.isUuid = exports.packageDetails = void 0;
const UUID = __importStar(require("uuid"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
exports.packageDetails = require('../package.json');
function isUuid(uuid) {
    return UUID.validate(uuid) || UUID.validate(expandUuid(uuid));
}
exports.isUuid = isUuid;
function cleanUuid(uuid) {
    return uuid.replace(/-/g, '');
}
exports.cleanUuid = cleanUuid;
function expandUuid(uuid) {
    let result = '';
    result = '-' + uuid.substr(20, 12) + result;
    result = '-' + uuid.substr(16, 4) + result;
    result = '-' + uuid.substr(12, 4) + result;
    result = '-' + uuid.substr(8, 4) + result;
    result = uuid.substr(0, 8) + result;
    return result;
}
exports.expandUuid = expandUuid;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFPN0IsOERBQThEO0FBQ2pELFFBQUEsY0FBYyxHQUFtQixPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUV6RSxTQUFnQixNQUFNLENBQUMsSUFBWTtJQUMvQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBRkQsd0JBRUM7QUFDRCxTQUFnQixTQUFTLENBQUMsSUFBWTtJQUNsQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFGRCw4QkFFQztBQUNELFNBQWdCLFVBQVUsQ0FBQyxJQUFZO0lBQ25DLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUVoQixNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUM1QyxNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUMzQyxNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUMzQyxNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUMxQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBRXBDLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFWRCxnQ0FVQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFVVSUQgZnJvbSAndXVpZCc7XG5cbmV4cG9ydCB0eXBlIE51bGxWYWx1ZSA9IHVuZGVmaW5lZCB8IG51bGw7XG5leHBvcnQgdHlwZSBQYWNrYWdlRGV0YWlscyA9IHtcbiAgICB2ZXJzaW9uOiBzdHJpbmdcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby12YXItcmVxdWlyZXNcbmV4cG9ydCBjb25zdCBwYWNrYWdlRGV0YWlsczogUGFja2FnZURldGFpbHMgPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVXVpZCh1dWlkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gVVVJRC52YWxpZGF0ZSh1dWlkKSB8fCBVVUlELnZhbGlkYXRlKGV4cGFuZFV1aWQodXVpZCkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuVXVpZCh1dWlkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB1dWlkLnJlcGxhY2UoLy0vZywgJycpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGV4cGFuZFV1aWQodXVpZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgICByZXN1bHQgPSAnLScgKyB1dWlkLnN1YnN0cigyMCwgMTIpICsgcmVzdWx0O1xuICAgIHJlc3VsdCA9ICctJyArIHV1aWQuc3Vic3RyKDE2LCA0KSArIHJlc3VsdDtcbiAgICByZXN1bHQgPSAnLScgKyB1dWlkLnN1YnN0cigxMiwgNCkgKyByZXN1bHQ7XG4gICAgcmVzdWx0ID0gJy0nICsgdXVpZC5zdWJzdHIoOCwgNCkgKyByZXN1bHQ7XG4gICAgcmVzdWx0ID0gdXVpZC5zdWJzdHIoMCwgOCkgKyByZXN1bHQ7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufSJdfQ==