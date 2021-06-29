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
     */
    constructor(baseUrl) {
        // base constructions
        this.baseUrl = baseUrl;
        this.agent = superagent_1.default.agent();
        // enable caching
        this.cache = new cache_service_cache_module_1.default({ defaultExpiration: 60 });
        this.agent.use(superagent_cache_plugin_1.default(this.cache));
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
    request(method, path, queryParams) {
        const url = this.url(path, queryParams);
        const req = () => {
            switch (method) {
                case 'GET':
                    return this.agent.get(url);
                case 'HEAD':
                    return this.agent.head(url);
                case 'POST':
                    return this.agent.post(url);
                case 'PUT':
                    return this.agent.put(url);
                case 'DELETE':
                    return this.agent.delete(url);
                case 'CONNECT':
                    return this.agent.connect(url);
                case 'OPTIONS':
                    return this.agent.options(url);
                case 'TRACE':
                    return this.agent.trace(url);
                case 'PATCH':
                    return this.agent.patch(url);
                default:
                    throw new Error(`Invalid HTTP method '${method}`);
            }
        };
        return req()
            .set('User-Agent', `Mojang.JS/${Util.packageDetails.version}`);
    }
    get(path, queryParams = {}) {
        return this.request('GET', path, queryParams);
    }
    post(path, queryParams = {}) {
        return this.request('POST', path, queryParams);
    }
}
exports.BaseClient = BaseClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9CYXNlQ2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBb0M7QUFDcEMsc0JBQXNCO0FBQ3RCLGFBQWE7QUFDYixzRkFBa0Q7QUFDbEQsYUFBYTtBQUNiLDRGQUFxRDtBQUVyRCw2Q0FBK0I7QUFNL0IsTUFBc0IsVUFBVTtJQWU1Qjs7O09BR0c7SUFDSCxZQUFZLE9BQWU7UUFDdkIscUJBQXFCO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsb0JBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVoQyxpQkFBaUI7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLG9DQUFXLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGlDQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNEOzs7Ozs7T0FNRztJQUNILEdBQUcsQ0FBQyxJQUFZLEVBQUUsTUFBbUI7UUFDakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QyxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDbkMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFCLElBQUksS0FBSztnQkFDTCxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDdEQ7UUFDRCxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsT0FBTyxDQUFDLE1BQWtCLEVBQUUsSUFBWSxFQUFFLFdBQXdCO1FBQzlELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRTtZQUNiLFFBQVEsTUFBTSxFQUFFO2dCQUNoQixLQUFLLEtBQUs7b0JBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDL0IsS0FBSyxNQUFNO29CQUNQLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLEtBQUssTUFBTTtvQkFDUCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQyxLQUFLLEtBQUs7b0JBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDL0IsS0FBSyxRQUFRO29CQUNULE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLEtBQUssU0FBUztvQkFDVixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQyxLQUFLLFNBQVM7b0JBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkMsS0FBSyxPQUFPO29CQUNSLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pDLEtBQUssT0FBTztvQkFDUixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQztvQkFDSSxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQ3JEO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsT0FBTyxHQUFHLEVBQUU7YUFDUCxHQUFHLENBQUMsWUFBWSxFQUFFLGFBQWEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFDRCxHQUFHLENBQUMsSUFBWSxFQUFFLGNBQTJCLEVBQUU7UUFDM0MsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELElBQUksQ0FBQyxJQUFZLEVBQUUsY0FBMkIsRUFBRTtRQUM1QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0o7QUFqRkQsZ0NBaUZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHN1cGVyYWdlbnQgZnJvbSAnc3VwZXJhZ2VudCc7XG4vLyBubyB0eXBlIGRlZmluaXRpb25zXG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgY2FjaGVQbHVnaW4gZnJvbSAnc3VwZXJhZ2VudC1jYWNoZS1wbHVnaW4nO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IENhY2hlTW9kdWxlIGZyb20gJ2NhY2hlLXNlcnZpY2UtY2FjaGUtbW9kdWxlJztcblxuaW1wb3J0ICogYXMgVXRpbCBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHR5cGUgeyBOdWxsVmFsdWUgfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgdHlwZSBRdWVyeVBhcmFtcyA9IHtba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBOdWxsVmFsdWV9O1xuZXhwb3J0IHR5cGUgSFRUUE1ldGhvZCA9ICdHRVQnIHwgJ0hFQUQnIHwgJ1BPU1QnIHwgJ1BVVCcgfCAnREVMRVRFJyB8ICdDT05ORUNUJyB8ICdPUFRJT05TJyB8ICdUUkFDRScgfCAnUEFUQ0gnXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlQ2xpZW50IHtcbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBVUkwgb2Ygd2hlcmUgdGhlIGNsaWVudCBtYWtlcyByZXF1ZXN0cy5cbiAgICAgKi9cbiAgICBiYXNlVXJsOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogVGhlIHVuZGVybHlpbmcgYWdlbnQsIGZyb20gU3VwZXJhZ2VudC5cbiAgICAgKi9cbiAgICBhZ2VudDogc3VwZXJhZ2VudC5TdXBlckFnZW50U3RhdGljICYgc3VwZXJhZ2VudC5SZXF1ZXN0XG4gICAgLyoqXG4gICAgICogVGhlIGNhY2hlIG1vZHVsZS5cbiAgICAgKiBBbnkgdHlwZSwgc2luY2UgdGhlIHBhY2thZ2UgdXNlZCBmb3IgY2FjaGluZyBkb2Vzbid0IHByb3ZpZGVcbiAgICAgKi9cbiAgICBjYWNoZTogYW55XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IEFQSSBjbGllbnQuXG4gICAgICogQHBhcmFtIGJhc2VVcmwgVGhlIGJhc2UgVVJMIGZvciByZXF1ZXN0cyBtYWRlIGJ5IHRoaXMgY2xpZW50LlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGJhc2VVcmw6IHN0cmluZykge1xuICAgICAgICAvLyBiYXNlIGNvbnN0cnVjdGlvbnNcbiAgICAgICAgdGhpcy5iYXNlVXJsID0gYmFzZVVybDtcbiAgICAgICAgdGhpcy5hZ2VudCA9IHN1cGVyYWdlbnQuYWdlbnQoKTtcblxuICAgICAgICAvLyBlbmFibGUgY2FjaGluZ1xuICAgICAgICB0aGlzLmNhY2hlID0gbmV3IENhY2hlTW9kdWxlKHsgZGVmYXVsdEV4cGlyYXRpb246IDYwIH0pO1xuICAgICAgICB0aGlzLmFnZW50LnVzZShjYWNoZVBsdWdpbih0aGlzLmNhY2hlKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgYSBVUkwgYmFzZWQgb24gdGhlIHtAbGluayBCYXNlQ2xpZW50LmJhc2VVcmx9IGFuZCBwYXRoIHNwZWNpZmllZC5cbiAgICAgKiBBY2NlcHRzIHF1ZXJ5IHBhcmFtZXRlcnMuXG4gICAgICogXG4gICAgICogQHBhcmFtIHBhdGggVGhlIHBhdGggdG8gYXBwZW5kXG4gICAgICogQHBhcmFtIHBhcmFtcyBUaGUgcXVlcnkgcGFyYW1ldGVyc1xuICAgICAqL1xuICAgIHVybChwYXRoOiBzdHJpbmcsIHBhcmFtczogUXVlcnlQYXJhbXMpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHBhdGgsIHRoaXMuYmFzZVVybCk7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHBhcmFtcykpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGFyYW1zW2tleV07XG4gICAgICAgICAgICBpZiAodmFsdWUpXG4gICAgICAgICAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoa2V5LCB2YWx1ZS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXJsLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgcmVxdWVzdChtZXRob2Q6IEhUVFBNZXRob2QsIHBhdGg6IHN0cmluZywgcXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zKTogc3VwZXJhZ2VudC5SZXF1ZXN0IHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy51cmwocGF0aCwgcXVlcnlQYXJhbXMpO1xuICAgICAgICBjb25zdCByZXEgPSAoKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgICAgICAgY2FzZSAnR0VUJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZ2VudC5nZXQodXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ0hFQUQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFnZW50LmhlYWQodXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ1BPU1QnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFnZW50LnBvc3QodXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ1BVVCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWdlbnQucHV0KHVybCk7XG4gICAgICAgICAgICBjYXNlICdERUxFVEUnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFnZW50LmRlbGV0ZSh1cmwpO1xuICAgICAgICAgICAgY2FzZSAnQ09OTkVDVCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWdlbnQuY29ubmVjdCh1cmwpO1xuICAgICAgICAgICAgY2FzZSAnT1BUSU9OUyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWdlbnQub3B0aW9ucyh1cmwpO1xuICAgICAgICAgICAgY2FzZSAnVFJBQ0UnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFnZW50LnRyYWNlKHVybCk7XG4gICAgICAgICAgICBjYXNlICdQQVRDSCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWdlbnQucGF0Y2godXJsKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEhUVFAgbWV0aG9kICcke21ldGhvZH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcmVxKClcbiAgICAgICAgICAgIC5zZXQoJ1VzZXItQWdlbnQnLCBgTW9qYW5nLkpTLyR7VXRpbC5wYWNrYWdlRGV0YWlscy52ZXJzaW9ufWApO1xuICAgIH1cbiAgICBnZXQocGF0aDogc3RyaW5nLCBxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgPSB7fSk6IHN1cGVyYWdlbnQuUmVxdWVzdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoJ0dFVCcsIHBhdGgsIHF1ZXJ5UGFyYW1zKTtcbiAgICB9XG4gICAgcG9zdChwYXRoOiBzdHJpbmcsIHF1ZXJ5UGFyYW1zOiBRdWVyeVBhcmFtcyA9IHt9KTogc3VwZXJhZ2VudC5SZXF1ZXN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdCgnUE9TVCcsIHBhdGgsIHF1ZXJ5UGFyYW1zKTtcbiAgICB9XG59Il19