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
     */
    constructor(baseUrl, useCache = true) {
        // base constructions
        this.baseUrl = baseUrl;
        this.agent = superagent_1.default.agent();
        if (useCache) {
            // enable caching
            this.cache = new cache_service_cache_module_1.default({ defaultExpiration: 60 });
            this.agent.use(superagent_cache_plugin_1.default(this.cache));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9CYXNlQ2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBb0M7QUFDcEMsc0JBQXNCO0FBQ3RCLGFBQWE7QUFDYixzRkFBa0Q7QUFDbEQsYUFBYTtBQUNiLDRGQUFxRDtBQUVyRCw2Q0FBK0I7QUFNL0IsTUFBc0IsVUFBVTtJQWU1Qjs7OztPQUlHO0lBQ0gsWUFBWSxPQUFlLEVBQUUsUUFBUSxHQUFHLElBQUk7UUFDeEMscUJBQXFCO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsb0JBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVoQyxJQUFJLFFBQVEsRUFBRTtZQUNWLGlCQUFpQjtZQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksb0NBQVcsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsaUNBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUMzQztJQUNMLENBQUM7SUFDRDs7Ozs7O09BTUc7SUFDSCxHQUFHLENBQUMsSUFBWSxFQUFFLE1BQW1CO1FBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEMsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ25DLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFJLEtBQUs7Z0JBQ0wsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ3REO1FBQ0QsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELE9BQU8sQ0FBQyxNQUFrQixFQUFFLElBQVksRUFBRSxXQUF3QjtRQUM5RCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN4QyxNQUFNLEdBQUcsR0FBRyxHQUFHLEVBQUU7WUFDYixRQUFRLE1BQU0sRUFBRTtnQkFDaEIsS0FBSyxLQUFLO29CQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQy9CLEtBQUssTUFBTTtvQkFDUCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQyxLQUFLLE1BQU07b0JBQ1AsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEMsS0FBSyxLQUFLO29CQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQy9CLEtBQUssUUFBUTtvQkFDVCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQyxLQUFLLFNBQVM7b0JBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkMsS0FBSyxTQUFTO29CQUNWLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ25DLEtBQUssT0FBTztvQkFDUixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQyxLQUFLLE9BQU87b0JBQ1IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakM7b0JBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUNyRDtRQUNMLENBQUMsQ0FBQztRQUVGLE9BQU8sR0FBRyxFQUFFO2FBQ1AsR0FBRyxDQUFDLFlBQVksRUFBRSxhQUFhLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBQ0QsR0FBRyxDQUFDLElBQVksRUFBRSxjQUEyQixFQUFFO1FBQzNDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRCxJQUFJLENBQUMsSUFBWSxFQUFFLGNBQTJCLEVBQUU7UUFDNUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDbkQsQ0FBQztDQUNKO0FBcEZELGdDQW9GQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzdXBlcmFnZW50IGZyb20gJ3N1cGVyYWdlbnQnO1xuLy8gbm8gdHlwZSBkZWZpbml0aW9uc1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IGNhY2hlUGx1Z2luIGZyb20gJ3N1cGVyYWdlbnQtY2FjaGUtcGx1Z2luJztcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCBDYWNoZU1vZHVsZSBmcm9tICdjYWNoZS1zZXJ2aWNlLWNhY2hlLW1vZHVsZSc7XG5cbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi91dGlsJztcbmltcG9ydCB0eXBlIHsgTnVsbFZhbHVlIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IHR5cGUgUXVlcnlQYXJhbXMgPSB7W2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgTnVsbFZhbHVlfTtcbmV4cG9ydCB0eXBlIEhUVFBNZXRob2QgPSAnR0VUJyB8ICdIRUFEJyB8ICdQT1NUJyB8ICdQVVQnIHwgJ0RFTEVURScgfCAnQ09OTkVDVCcgfCAnT1BUSU9OUycgfCAnVFJBQ0UnIHwgJ1BBVENIJ1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZUNsaWVudCB7XG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgVVJMIG9mIHdoZXJlIHRoZSBjbGllbnQgbWFrZXMgcmVxdWVzdHMuXG4gICAgICovXG4gICAgYmFzZVVybDogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIFRoZSB1bmRlcmx5aW5nIGFnZW50LCBmcm9tIFN1cGVyYWdlbnQuXG4gICAgICovXG4gICAgYWdlbnQ6IHN1cGVyYWdlbnQuU3VwZXJBZ2VudFN0YXRpYyAmIHN1cGVyYWdlbnQuUmVxdWVzdFxuICAgIC8qKlxuICAgICAqIFRoZSBjYWNoZSBtb2R1bGUuXG4gICAgICogQW55IHR5cGUsIHNpbmNlIHRoZSBwYWNrYWdlIHVzZWQgZm9yIGNhY2hpbmcgZG9lc24ndCBwcm92aWRlXG4gICAgICovXG4gICAgY2FjaGU6IGFueVxuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0cyBhIG5ldyBBUEkgY2xpZW50LlxuICAgICAqIEBwYXJhbSBiYXNlVXJsIFRoZSBiYXNlIFVSTCBmb3IgcmVxdWVzdHMgbWFkZSBieSB0aGlzIGNsaWVudC5cbiAgICAgKiBAcGFyYW0gdXNlQ2FjaGUgV2hldGhlciBvciBub3QgdG8gdXNlIGNhY2hpbmdcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihiYXNlVXJsOiBzdHJpbmcsIHVzZUNhY2hlID0gdHJ1ZSkge1xuICAgICAgICAvLyBiYXNlIGNvbnN0cnVjdGlvbnNcbiAgICAgICAgdGhpcy5iYXNlVXJsID0gYmFzZVVybDtcbiAgICAgICAgdGhpcy5hZ2VudCA9IHN1cGVyYWdlbnQuYWdlbnQoKTtcblxuICAgICAgICBpZiAodXNlQ2FjaGUpIHtcbiAgICAgICAgICAgIC8vIGVuYWJsZSBjYWNoaW5nXG4gICAgICAgICAgICB0aGlzLmNhY2hlID0gbmV3IENhY2hlTW9kdWxlKHsgZGVmYXVsdEV4cGlyYXRpb246IDYwIH0pO1xuICAgICAgICAgICAgdGhpcy5hZ2VudC51c2UoY2FjaGVQbHVnaW4odGhpcy5jYWNoZSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgYSBVUkwgYmFzZWQgb24gdGhlIHtAbGluayBCYXNlQ2xpZW50LmJhc2VVcmx9IGFuZCBwYXRoIHNwZWNpZmllZC5cbiAgICAgKiBBY2NlcHRzIHF1ZXJ5IHBhcmFtZXRlcnMuXG4gICAgICogXG4gICAgICogQHBhcmFtIHBhdGggVGhlIHBhdGggdG8gYXBwZW5kXG4gICAgICogQHBhcmFtIHBhcmFtcyBUaGUgcXVlcnkgcGFyYW1ldGVyc1xuICAgICAqL1xuICAgIHVybChwYXRoOiBzdHJpbmcsIHBhcmFtczogUXVlcnlQYXJhbXMpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHBhdGgsIHRoaXMuYmFzZVVybCk7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHBhcmFtcykpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGFyYW1zW2tleV07XG4gICAgICAgICAgICBpZiAodmFsdWUpXG4gICAgICAgICAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoa2V5LCB2YWx1ZS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXJsLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgcmVxdWVzdChtZXRob2Q6IEhUVFBNZXRob2QsIHBhdGg6IHN0cmluZywgcXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zKTogc3VwZXJhZ2VudC5SZXF1ZXN0IHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy51cmwocGF0aCwgcXVlcnlQYXJhbXMpO1xuICAgICAgICBjb25zdCByZXEgPSAoKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgICAgICAgY2FzZSAnR0VUJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZ2VudC5nZXQodXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ0hFQUQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFnZW50LmhlYWQodXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ1BPU1QnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFnZW50LnBvc3QodXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ1BVVCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWdlbnQucHV0KHVybCk7XG4gICAgICAgICAgICBjYXNlICdERUxFVEUnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFnZW50LmRlbGV0ZSh1cmwpO1xuICAgICAgICAgICAgY2FzZSAnQ09OTkVDVCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWdlbnQuY29ubmVjdCh1cmwpO1xuICAgICAgICAgICAgY2FzZSAnT1BUSU9OUyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWdlbnQub3B0aW9ucyh1cmwpO1xuICAgICAgICAgICAgY2FzZSAnVFJBQ0UnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFnZW50LnRyYWNlKHVybCk7XG4gICAgICAgICAgICBjYXNlICdQQVRDSCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWdlbnQucGF0Y2godXJsKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEhUVFAgbWV0aG9kICcke21ldGhvZH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcmVxKClcbiAgICAgICAgICAgIC5zZXQoJ1VzZXItQWdlbnQnLCBgTW9qYW5nLkpTLyR7VXRpbC5wYWNrYWdlRGV0YWlscy52ZXJzaW9ufWApO1xuICAgIH1cbiAgICBnZXQocGF0aDogc3RyaW5nLCBxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgPSB7fSk6IHN1cGVyYWdlbnQuUmVxdWVzdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoJ0dFVCcsIHBhdGgsIHF1ZXJ5UGFyYW1zKTtcbiAgICB9XG4gICAgcG9zdChwYXRoOiBzdHJpbmcsIHF1ZXJ5UGFyYW1zOiBRdWVyeVBhcmFtcyA9IHt9KTogc3VwZXJhZ2VudC5SZXF1ZXN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdCgnUE9TVCcsIHBhdGgsIHF1ZXJ5UGFyYW1zKTtcbiAgICB9XG59Il19