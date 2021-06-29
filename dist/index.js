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
exports.Util = exports.YggdrasilClient = exports.Yggdrasil = exports.MojangClient = exports.Mojang = exports.Base = void 0;
exports.Base = __importStar(require("./BaseClient"));
exports.Mojang = __importStar(require("./mojang"));
var mojang_1 = require("./mojang");
Object.defineProperty(exports, "MojangClient", { enumerable: true, get: function () { return mojang_1.Client; } });
exports.Yggdrasil = __importStar(require("./yggdrasil"));
var yggdrasil_1 = require("./yggdrasil");
Object.defineProperty(exports, "YggdrasilClient", { enumerable: true, get: function () { return yggdrasil_1.Client; } });
exports.Util = __importStar(require("./util"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFEQUFxQztBQUNyQyxtREFBbUM7QUFDbkMsbUNBQWtEO0FBQXpDLHNHQUFBLE1BQU0sT0FBZ0I7QUFDL0IseURBQXlDO0FBQ3pDLHlDQUF3RDtBQUEvQyw0R0FBQSxNQUFNLE9BQW1CO0FBQ2xDLCtDQUErQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCAqIGFzIEJhc2UgZnJvbSAnLi9CYXNlQ2xpZW50JztcbmV4cG9ydCAqIGFzIE1vamFuZyBmcm9tICcuL21vamFuZyc7XG5leHBvcnQgeyBDbGllbnQgYXMgTW9qYW5nQ2xpZW50IH0gZnJvbSAnLi9tb2phbmcnO1xuZXhwb3J0ICogYXMgWWdnZHJhc2lsIGZyb20gJy4veWdnZHJhc2lsJztcbmV4cG9ydCB7IENsaWVudCBhcyBZZ2dkcmFzaWxDbGllbnQgfSBmcm9tICcuL3lnZ2RyYXNpbCc7XG5leHBvcnQgKiBhcyBVdGlsIGZyb20gJy4vdXRpbCc7XG4iXX0=