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
exports.BaseClient = void 0;
var superagent = __importStar(require("superagent"));
var BaseClient = /** @class */ (function () {
    /**
     * Constructs a new API client.
     * @param baseUrl The base URL for requests made by this client.
     */
    function BaseClient(baseUrl) {
        this.baseUrl = baseUrl;
        this.agent = superagent.agent();
    }
    /**
     * Gets a URL based on the {@link BaseClient.baseUrl} and path specified.
     * Accepts query parameters.
     *
     * @param path The path to append
     * @param params The query parameters
     */
    BaseClient.prototype.url = function (path, params) {
        var url = new URL(path, this.baseUrl);
        for (var key in params) {
            var value = params[key];
            if (value)
                url.searchParams.append(key, value.toString());
        }
        return url.toString();
    };
    BaseClient.prototype.request = function (method, path, queryParams) {
        return this.agent(method, this.url(path, queryParams));
    };
    BaseClient.prototype.get = function (path, queryParams) {
        if (queryParams === void 0) { queryParams = {}; }
        return this.request('GET', path, queryParams);
    };
    BaseClient.prototype.post = function (path, queryParams) {
        if (queryParams === void 0) { queryParams = {}; }
        return this.agent.post(this.url(path, queryParams));
    };
    return BaseClient;
}());
exports.BaseClient = BaseClient;
//# sourceMappingURL=BaseClient.js.map