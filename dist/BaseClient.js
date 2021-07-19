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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClient = void 0;
const superagent_1 = __importDefault(require("superagent"));
// no type definitions
// @ts-ignore
const superagent_cache_plugin_1 = __importDefault(require("superagent-cache-plugin"));
// @ts-ignore
const cache_service_cache_module_1 = __importDefault(require("cache-service-cache-module"));
const Util = __importStar(require("./util"));
class BaseClient {
    /**
     * Constructs a new API client.
     * @param baseUrl The base URL for requests made by this client.
     * @param useCache Whether or not to use caching
     * @param defaultAuth The default authorisation token to use.
     */
    constructor(baseUrl, useCache = true, defaultAuth) {
        // base constructions
        this.baseUrl = baseUrl;
        this.agent = superagent_1.default.agent();
        if (useCache) {
            // enable caching
            this.cache = new cache_service_cache_module_1.default({ defaultExpiration: 60 });
            this.agent.use(superagent_cache_plugin_1.default(this.cache));
        }
        if (defaultAuth) {
            // has default authorisation
            this.defaultAuth = defaultAuth;
        }
        else {
            this.defaultAuth = () => null;
        }
    }
    /**
     * Gets a URL based on the {@link BaseClient.baseUrl} and path specified.
     * Accepts query parameters.
     *
     * @param path The path to append
     * @param params The query parameters
     */
    url(path, params) {
        const url = new URL(path, this.baseUrl);
        for (const key of Object.keys(params)) {
            const value = params[key];
            if (value)
                url.searchParams.append(key, value.toString());
        }
        return url.toString();
    }
    request(method, path, queryParams, auth = this.defaultAuth()) {
        let r;
        switch (method) {
            case 'GET':
                r = this.agent.get;
                break;
            case 'HEAD':
                r = this.agent.head;
                break;
            case 'POST':
                r = this.agent.post;
                break;
            case 'PUT':
                r = this.agent.put;
                break;
            case 'DELETE':
                r = this.agent.delete;
                break;
            case 'CONNECT':
                r = this.agent.connect;
                break;
            case 'OPTIONS':
                r = this.agent.options;
                break;
            case 'TRACE':
                r = this.agent.trace;
                break;
            case 'PATCH':
                r = this.agent.patch;
                break;
            default:
                throw new Error(`Invalid HTTP method '${method}`);
        }
        const url = this.url(path, queryParams);
        let req = r.bind(this.agent)(url)
            .set('User-Agent', `Mojang.JS/${Util.packageDetails.version}`);
        if (auth)
            req = req.auth(auth, { type: 'bearer' });
        return req;
    }
    get(path, queryParams = {}, auth = this.defaultAuth()) {
        return this.request('GET', path, queryParams, auth);
    }
    post(path, queryParams = {}, auth = this.defaultAuth()) {
        return this.request('POST', path, queryParams, auth);
    }
    put(path, queryParams = {}, auth = this.defaultAuth()) {
        return this.request('PUT', path, queryParams, auth);
    }
}
exports.BaseClient = BaseClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9CYXNlQ2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBb0M7QUFDcEMsc0JBQXNCO0FBQ3RCLGFBQWE7QUFDYixzRkFBa0Q7QUFDbEQsYUFBYTtBQUNiLDRGQUFxRDtBQUdyRCw2Q0FBK0I7QUFLL0IsTUFBc0IsVUFBVTtJQWlCNUI7Ozs7O09BS0c7SUFDSCxZQUFZLE9BQWUsRUFBRSxRQUFRLEdBQUcsSUFBSSxFQUFFLFdBQXNDO1FBQ2hGLHFCQUFxQjtRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLG9CQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFaEMsSUFBSSxRQUFRLEVBQUU7WUFDVixpQkFBaUI7WUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLG9DQUFXLENBQUMsRUFBQyxpQkFBaUIsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGlDQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDM0M7UUFFRCxJQUFJLFdBQVcsRUFBRTtZQUNiLDRCQUE0QjtZQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztTQUNsQzthQUFNO1lBQ0gsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7U0FDakM7SUFDTCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsR0FBRyxDQUFDLElBQVksRUFBRSxNQUFtQjtRQUNqQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FB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QUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNKO0FBL0dELGdDQStHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzdXBlcmFnZW50IGZyb20gJ3N1cGVyYWdlbnQnO1xuLy8gbm8gdHlwZSBkZWZpbml0aW9uc1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IGNhY2hlUGx1Z2luIGZyb20gJ3N1cGVyYWdlbnQtY2FjaGUtcGx1Z2luJztcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCBDYWNoZU1vZHVsZSBmcm9tICdjYWNoZS1zZXJ2aWNlLWNhY2hlLW1vZHVsZSc7XG5cbmltcG9ydCB0eXBlIHsgTnVsbFZhbHVlIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IHR5cGUgUXVlcnlQYXJhbXMgPSB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IE51bGxWYWx1ZSB9O1xuZXhwb3J0IHR5cGUgSFRUUE1ldGhvZCA9ICdHRVQnIHwgJ0hFQUQnIHwgJ1BPU1QnIHwgJ1BVVCcgfCAnREVMRVRFJyB8ICdDT05ORUNUJyB8ICdPUFRJT05TJyB8ICdUUkFDRScgfCAnUEFUQ0gnXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlQ2xpZW50IHtcbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBVUkwgb2Ygd2hlcmUgdGhlIGNsaWVudCBtYWtlcyByZXF1ZXN0cy5cbiAgICAgKi9cbiAgICBiYXNlVXJsOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogVGhlIHVuZGVybHlpbmcgYWdlbnQsIGZyb20gU3VwZXJhZ2VudC5cbiAgICAgKi9cbiAgICBhZ2VudDogc3VwZXJhZ2VudC5TdXBlckFnZW50U3RhdGljICYgc3VwZXJhZ2VudC5SZXF1ZXN0O1xuICAgIC8qKlxuICAgICAqIFRoZSBjYWNoZSBtb2R1bGUuXG4gICAgICogQW55IHR5cGUsIHNpbmNlIHRoZSBwYWNrYWdlIHVzZWQgZm9yIGNhY2hpbmcgZG9lc24ndCBwcm92aWRlXG4gICAgICovXG4gICAgY2FjaGU6IGFueTtcblxuICAgIHByaXZhdGUgZGVmYXVsdEF1dGg6ICgpID0+IHN0cmluZyB8IE51bGxWYWx1ZVxuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0cyBhIG5ldyBBUEkgY2xpZW50LlxuICAgICAqIEBwYXJhbSBiYXNlVXJsIFRoZSBiYXNlIFVSTCBmb3IgcmVxdWVzdHMgbWFkZSBieSB0aGlzIGNsaWVudC5cbiAgICAgKiBAcGFyYW0gdXNlQ2FjaGUgV2hldGhlciBvciBub3QgdG8gdXNlIGNhY2hpbmdcbiAgICAgKiBAcGFyYW0gZGVmYXVsdEF1dGggVGhlIGRlZmF1bHQgYXV0aG9yaXNhdGlvbiB0b2tlbiB0byB1c2UuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoYmFzZVVybDogc3RyaW5nLCB1c2VDYWNoZSA9IHRydWUsIGRlZmF1bHRBdXRoPzogKCkgPT4gc3RyaW5nIHwgTnVsbFZhbHVlKSB7XG4gICAgICAgIC8vIGJhc2UgY29uc3RydWN0aW9uc1xuICAgICAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsO1xuICAgICAgICB0aGlzLmFnZW50ID0gc3VwZXJhZ2VudC5hZ2VudCgpO1xuXG4gICAgICAgIGlmICh1c2VDYWNoZSkge1xuICAgICAgICAgICAgLy8gZW5hYmxlIGNhY2hpbmdcbiAgICAgICAgICAgIHRoaXMuY2FjaGUgPSBuZXcgQ2FjaGVNb2R1bGUoe2RlZmF1bHRFeHBpcmF0aW9uOiA2MH0pO1xuICAgICAgICAgICAgdGhpcy5hZ2VudC51c2UoY2FjaGVQbHVnaW4odGhpcy5jYWNoZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlZmF1bHRBdXRoKSB7XG4gICAgICAgICAgICAvLyBoYXMgZGVmYXVsdCBhdXRob3Jpc2F0aW9uXG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRBdXRoID0gZGVmYXVsdEF1dGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRBdXRoID0gKCkgPT4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBVUkwgYmFzZWQgb24gdGhlIHtAbGluayBCYXNlQ2xpZW50LmJhc2VVcmx9IGFuZCBwYXRoIHNwZWNpZmllZC5cbiAgICAgKiBBY2NlcHRzIHF1ZXJ5IHBhcmFtZXRlcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGF0aCBUaGUgcGF0aCB0byBhcHBlbmRcbiAgICAgKiBAcGFyYW0gcGFyYW1zIFRoZSBxdWVyeSBwYXJhbWV0ZXJzXG4gICAgICovXG4gICAgdXJsKHBhdGg6IHN0cmluZywgcGFyYW1zOiBRdWVyeVBhcmFtcyk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocGF0aCwgdGhpcy5iYXNlVXJsKTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMocGFyYW1zKSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXJhbXNba2V5XTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcbiAgICAgICAgICAgICAgICB1cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChrZXksIHZhbHVlLnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1cmwudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICByZXF1ZXN0KG1ldGhvZDogSFRUUE1ldGhvZCwgcGF0aDogc3RyaW5nLCBxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMsIGF1dGg6IHN0cmluZyB8IE51bGxWYWx1ZSA9IHRoaXMuZGVmYXVsdEF1dGgoKSk6IHN1cGVyYWdlbnQuUmVxdWVzdCB7XG4gICAgICAgIGxldCByO1xuICAgICAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgICBjYXNlICdHRVQnOlxuICAgICAgICAgICAgciA9IHRoaXMuYWdlbnQuZ2V0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0hFQUQnOlxuICAgICAgICAgICAgciA9IHRoaXMuYWdlbnQuaGVhZDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdQT1NUJzpcbiAgICAgICAgICAgIHIgPSB0aGlzLmFnZW50LnBvc3Q7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnUFVUJzpcbiAgICAgICAgICAgIHIgPSB0aGlzLmFnZW50LnB1dDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdERUxFVEUnOlxuICAgICAgICAgICAgciA9IHRoaXMuYWdlbnQuZGVsZXRlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0NPTk5FQ1QnOlxuICAgICAgICAgICAgciA9IHRoaXMuYWdlbnQuY29ubmVjdDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdPUFRJT05TJzpcbiAgICAgICAgICAgIHIgPSB0aGlzLmFnZW50Lm9wdGlvbnM7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnVFJBQ0UnOlxuICAgICAgICAgICAgciA9IHRoaXMuYWdlbnQudHJhY2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnUEFUQ0gnOlxuICAgICAgICAgICAgciA9IHRoaXMuYWdlbnQucGF0Y2g7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBIVFRQIG1ldGhvZCAnJHttZXRob2R9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy51cmwocGF0aCwgcXVlcnlQYXJhbXMpO1xuXG4gICAgICAgIGxldCByZXEgPSByLmJpbmQodGhpcy5hZ2VudCkodXJsKVxuICAgICAgICAgICAgLnNldCgnVXNlci1BZ2VudCcsIGBNb2phbmcuSlMvJHtVdGlsLnBhY2thZ2VEZXRhaWxzLnZlcnNpb259YCk7XG4gICAgICAgIGlmIChhdXRoKSByZXEgPSByZXEuYXV0aChhdXRoLCB7IHR5cGU6ICdiZWFyZXInIH0pO1xuICAgICAgICByZXR1cm4gcmVxO1xuICAgIH1cblxuICAgIGdldChwYXRoOiBzdHJpbmcsIHF1ZXJ5UGFyYW1zOiBRdWVyeVBhcmFtcyA9IHt9LCBhdXRoOiBzdHJpbmcgfCBOdWxsVmFsdWUgPSB0aGlzLmRlZmF1bHRBdXRoKCkpOiBzdXBlcmFnZW50LlJlcXVlc3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCdHRVQnLCBwYXRoLCBxdWVyeVBhcmFtcywgYXV0aCk7XG4gICAgfVxuXG4gICAgcG9zdChwYXRoOiBzdHJpbmcsIHF1ZXJ5UGFyYW1zOiBRdWVyeVBhcmFtcyA9IHt9LCBhdXRoOiBzdHJpbmcgfCBOdWxsVmFsdWUgPSB0aGlzLmRlZmF1bHRBdXRoKCkpOiBzdXBlcmFnZW50LlJlcXVlc3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCdQT1NUJywgcGF0aCwgcXVlcnlQYXJhbXMsIGF1dGgpO1xuICAgIH1cblxuICAgIHB1dChwYXRoOiBzdHJpbmcsIHF1ZXJ5UGFyYW1zOiBRdWVyeVBhcmFtcyA9IHt9LCBhdXRoOiBzdHJpbmcgfCBOdWxsVmFsdWUgPSB0aGlzLmRlZmF1bHRBdXRoKCkpOiBzdXBlcmFnZW50LlJlcXVlc3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KCdQVVQnLCBwYXRoLCBxdWVyeVBhcmFtcywgYXV0aCk7XG4gICAgfVxufSJdfQ==