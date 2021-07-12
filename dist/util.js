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
exports.warn = exports.base64Encode = exports.base64Decode = exports.expandUuid = exports.cleanUuid = exports.isUuid = exports.packageDetails = void 0;
const UUID = __importStar(require("uuid"));
const Base64 = __importStar(require("base-64"));
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
/* Base64 utilities */
function base64Decode(data) {
    return Base64.decode(data);
}
exports.base64Decode = base64Decode;
function base64Encode(data) {
    return Base64.encode(data.toString());
}
exports.base64Encode = base64Encode;
function warn(...msg) {
    return console.warn('[mojang.js]', ...msg);
}
exports.warn = warn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0IsZ0RBQWtDO0FBT2xDLDhEQUE4RDtBQUNqRCxRQUFBLGNBQWMsR0FBbUIsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFFekUsU0FBZ0IsTUFBTSxDQUFDLElBQVk7SUFDL0IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUZELHdCQUVDO0FBQ0QsU0FBZ0IsU0FBUyxDQUFDLElBQVk7SUFDbEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRkQsOEJBRUM7QUFDRCxTQUFnQixVQUFVLENBQUMsSUFBWTtJQUNuQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFFaEIsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDNUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDM0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDM0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDMUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUVwQyxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBVkQsZ0NBVUM7QUFFRCxzQkFBc0I7QUFFdEIsU0FBZ0IsWUFBWSxDQUFDLElBQVk7SUFDckMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFGRCxvQ0FFQztBQUNELFNBQWdCLFlBQVksQ0FBQyxJQUFTO0lBQ2xDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRkQsb0NBRUM7QUFFRCxTQUFnQixJQUFJLENBQUMsR0FBRyxHQUFRO0lBQzVCLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBRkQsb0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBVVUlEIGZyb20gJ3V1aWQnO1xuaW1wb3J0ICogYXMgQmFzZTY0IGZyb20gJ2Jhc2UtNjQnO1xuXG5leHBvcnQgdHlwZSBOdWxsVmFsdWUgPSB1bmRlZmluZWQgfCBudWxsO1xuZXhwb3J0IHR5cGUgUGFja2FnZURldGFpbHMgPSB7XG4gICAgdmVyc2lvbjogc3RyaW5nXG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzXG5leHBvcnQgY29uc3QgcGFja2FnZURldGFpbHM6IFBhY2thZ2VEZXRhaWxzID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1V1aWQodXVpZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFVVSUQudmFsaWRhdGUodXVpZCkgfHwgVVVJRC52YWxpZGF0ZShleHBhbmRVdWlkKHV1aWQpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjbGVhblV1aWQodXVpZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXVpZC5yZXBsYWNlKC8tL2csICcnKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBleHBhbmRVdWlkKHV1aWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IHJlc3VsdCA9ICcnO1xuXG4gICAgcmVzdWx0ID0gJy0nICsgdXVpZC5zdWJzdHIoMjAsIDEyKSArIHJlc3VsdDtcbiAgICByZXN1bHQgPSAnLScgKyB1dWlkLnN1YnN0cigxNiwgNCkgKyByZXN1bHQ7XG4gICAgcmVzdWx0ID0gJy0nICsgdXVpZC5zdWJzdHIoMTIsIDQpICsgcmVzdWx0O1xuICAgIHJlc3VsdCA9ICctJyArIHV1aWQuc3Vic3RyKDgsIDQpICsgcmVzdWx0O1xuICAgIHJlc3VsdCA9IHV1aWQuc3Vic3RyKDAsIDgpICsgcmVzdWx0O1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyogQmFzZTY0IHV0aWxpdGllcyAqL1xuXG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0RGVjb2RlKGRhdGE6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEJhc2U2NC5kZWNvZGUoZGF0YSk7XG59XG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0RW5jb2RlKGRhdGE6IGFueSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEJhc2U2NC5lbmNvZGUoZGF0YS50b1N0cmluZygpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhcm4oLi4ubXNnOiBhbnkpOiB2b2lkIHtcbiAgICByZXR1cm4gY29uc29sZS53YXJuKCdbbW9qYW5nLmpzXScsIC4uLm1zZyk7XG59Il19