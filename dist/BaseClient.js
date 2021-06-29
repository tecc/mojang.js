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
const Util = __importStar(require("./util"));
class BaseClient {
    /**
     * Constructs a new API client.
     * @param baseUrl The base URL for requests made by this client.
     */
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.agent = superagent_1.default.agent();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9CYXNlQ2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBb0M7QUFDcEMsNkNBQStCO0FBTS9CLE1BQXNCLFVBQVU7SUFJNUI7OztPQUdHO0lBQ0gsWUFBWSxPQUFlO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsb0JBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBQ0Q7Ozs7OztPQU1HO0lBQ0gsR0FBRyxDQUFDLElBQVksRUFBRSxNQUFtQjtRQUNqQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNuQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUIsSUFBSSxLQUFLO2dCQUNMLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUN0RDtRQUNELE9BQU8sR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxPQUFPLENBQUMsTUFBa0IsRUFBRSxJQUFZLEVBQUUsV0FBd0I7UUFDOUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDeEMsTUFBTSxHQUFHLEdBQUcsR0FBRyxFQUFFO1lBQ2IsUUFBUSxNQUFNLEVBQUU7Z0JBQ2hCLEtBQUssS0FBSztvQkFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQixLQUFLLE1BQU07b0JBQ1AsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEMsS0FBSyxNQUFNO29CQUNQLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLEtBQUssS0FBSztvQkFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQixLQUFLLFFBQVE7b0JBQ1QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsS0FBSyxTQUFTO29CQUNWLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ25DLEtBQUssU0FBUztvQkFDVixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQyxLQUFLLE9BQU87b0JBQ1IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakMsS0FBSyxPQUFPO29CQUNSLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pDO29CQUNJLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDckQ7UUFDTCxDQUFDLENBQUM7UUFFRixPQUFPLEdBQUcsRUFBRTthQUNQLEdBQUcsQ0FBQyxZQUFZLEVBQUUsYUFBYSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUNELEdBQUcsQ0FBQyxJQUFZLEVBQUUsY0FBMkIsRUFBRTtRQUMzQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsSUFBSSxDQUFDLElBQVksRUFBRSxjQUEyQixFQUFFO1FBQzVDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Q0FDSjtBQWpFRCxnQ0FpRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3VwZXJhZ2VudCBmcm9tICdzdXBlcmFnZW50JztcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi91dGlsJztcbmltcG9ydCB0eXBlIHsgTnVsbFZhbHVlIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IHR5cGUgUXVlcnlQYXJhbXMgPSB7W2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgTnVsbFZhbHVlfTtcbmV4cG9ydCB0eXBlIEhUVFBNZXRob2QgPSAnR0VUJyB8ICdIRUFEJyB8ICdQT1NUJyB8ICdQVVQnIHwgJ0RFTEVURScgfCAnQ09OTkVDVCcgfCAnT1BUSU9OUycgfCAnVFJBQ0UnIHwgJ1BBVENIJ1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZUNsaWVudCB7XG4gICAgYmFzZVVybDogc3RyaW5nO1xuICAgIGFnZW50OiBzdXBlcmFnZW50LlN1cGVyQWdlbnRTdGF0aWMgJiBzdXBlcmFnZW50LlJlcXVlc3RcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYSBuZXcgQVBJIGNsaWVudC5cbiAgICAgKiBAcGFyYW0gYmFzZVVybCBUaGUgYmFzZSBVUkwgZm9yIHJlcXVlc3RzIG1hZGUgYnkgdGhpcyBjbGllbnQuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoYmFzZVVybDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYmFzZVVybCA9IGJhc2VVcmw7XG4gICAgICAgIHRoaXMuYWdlbnQgPSBzdXBlcmFnZW50LmFnZW50KCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgYSBVUkwgYmFzZWQgb24gdGhlIHtAbGluayBCYXNlQ2xpZW50LmJhc2VVcmx9IGFuZCBwYXRoIHNwZWNpZmllZC5cbiAgICAgKiBBY2NlcHRzIHF1ZXJ5IHBhcmFtZXRlcnMuXG4gICAgICogXG4gICAgICogQHBhcmFtIHBhdGggVGhlIHBhdGggdG8gYXBwZW5kXG4gICAgICogQHBhcmFtIHBhcmFtcyBUaGUgcXVlcnkgcGFyYW1ldGVyc1xuICAgICAqL1xuICAgIHVybChwYXRoOiBzdHJpbmcsIHBhcmFtczogUXVlcnlQYXJhbXMpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHBhdGgsIHRoaXMuYmFzZVVybCk7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHBhcmFtcykpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGFyYW1zW2tleV07XG4gICAgICAgICAgICBpZiAodmFsdWUpXG4gICAgICAgICAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoa2V5LCB2YWx1ZS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXJsLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgcmVxdWVzdChtZXRob2Q6IEhUVFBNZXRob2QsIHBhdGg6IHN0cmluZywgcXVlcnlQYXJhbXM6IFF1ZXJ5UGFyYW1zKTogc3VwZXJhZ2VudC5SZXF1ZXN0IHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy51cmwocGF0aCwgcXVlcnlQYXJhbXMpO1xuICAgICAgICBjb25zdCByZXEgPSAoKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgICAgICAgY2FzZSAnR0VUJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZ2VudC5nZXQodXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ0hFQUQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFnZW50LmhlYWQodXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ1BPU1QnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFnZW50LnBvc3QodXJsKTtcbiAgICAgICAgICAgIGNhc2UgJ1BVVCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWdlbnQucHV0KHVybCk7XG4gICAgICAgICAgICBjYXNlICdERUxFVEUnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFnZW50LmRlbGV0ZSh1cmwpO1xuICAgICAgICAgICAgY2FzZSAnQ09OTkVDVCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWdlbnQuY29ubmVjdCh1cmwpO1xuICAgICAgICAgICAgY2FzZSAnT1BUSU9OUyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWdlbnQub3B0aW9ucyh1cmwpO1xuICAgICAgICAgICAgY2FzZSAnVFJBQ0UnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFnZW50LnRyYWNlKHVybCk7XG4gICAgICAgICAgICBjYXNlICdQQVRDSCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWdlbnQucGF0Y2godXJsKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEhUVFAgbWV0aG9kICcke21ldGhvZH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcmVxKClcbiAgICAgICAgICAgIC5zZXQoJ1VzZXItQWdlbnQnLCBgTW9qYW5nLkpTLyR7VXRpbC5wYWNrYWdlRGV0YWlscy52ZXJzaW9ufWApO1xuICAgIH1cbiAgICBnZXQocGF0aDogc3RyaW5nLCBxdWVyeVBhcmFtczogUXVlcnlQYXJhbXMgPSB7fSk6IHN1cGVyYWdlbnQuUmVxdWVzdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoJ0dFVCcsIHBhdGgsIHF1ZXJ5UGFyYW1zKTtcbiAgICB9XG4gICAgcG9zdChwYXRoOiBzdHJpbmcsIHF1ZXJ5UGFyYW1zOiBRdWVyeVBhcmFtcyA9IHt9KTogc3VwZXJhZ2VudC5SZXF1ZXN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdCgnUE9TVCcsIHBhdGgsIHF1ZXJ5UGFyYW1zKTtcbiAgICB9XG59Il19