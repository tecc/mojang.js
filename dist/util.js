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
exports.expandUuid = exports.cleanUuid = exports.validate = void 0;
const UUID = __importStar(require("uuid"));
function validate(uuid) {
    return UUID.validate(uuid) || UUID.validate(expandUuid(uuid));
}
exports.validate = validate;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFJN0IsU0FBZ0IsUUFBUSxDQUFDLElBQVk7SUFDakMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUZELDRCQUVDO0FBQ0QsU0FBZ0IsU0FBUyxDQUFDLElBQVk7SUFDbEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRkQsOEJBRUM7QUFDRCxTQUFnQixVQUFVLENBQUMsSUFBWTtJQUNuQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFFaEIsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDNUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDM0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDM0MsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDMUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUVwQyxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBVkQsZ0NBVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBVVUlEIGZyb20gJ3V1aWQnO1xuXG5leHBvcnQgdHlwZSBOdWxsVmFsdWUgPSB1bmRlZmluZWQgfCBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGUodXVpZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFVVSUQudmFsaWRhdGUodXVpZCkgfHwgVVVJRC52YWxpZGF0ZShleHBhbmRVdWlkKHV1aWQpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjbGVhblV1aWQodXVpZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXVpZC5yZXBsYWNlKC8tL2csICcnKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBleHBhbmRVdWlkKHV1aWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IHJlc3VsdCA9ICcnO1xuXG4gICAgcmVzdWx0ID0gJy0nICsgdXVpZC5zdWJzdHIoMjAsIDEyKSArIHJlc3VsdDtcbiAgICByZXN1bHQgPSAnLScgKyB1dWlkLnN1YnN0cigxNiwgNCkgKyByZXN1bHQ7XG4gICAgcmVzdWx0ID0gJy0nICsgdXVpZC5zdWJzdHIoMTIsIDQpICsgcmVzdWx0O1xuICAgIHJlc3VsdCA9ICctJyArIHV1aWQuc3Vic3RyKDgsIDQpICsgcmVzdWx0O1xuICAgIHJlc3VsdCA9IHV1aWQuc3Vic3RyKDAsIDgpICsgcmVzdWx0O1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn0iXX0=