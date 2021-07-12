import superagent from 'superagent';
// no type definitions
// @ts-ignore
import cachePlugin from 'superagent-cache-plugin';
// @ts-ignore
import CacheModule from 'cache-service-cache-module';

import * as Util from './util';
import type { NullValue } from './util';

export type QueryParams = {[key: string]: string | number | NullValue};
export type HTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

export abstract class BaseClient {
    /**
     * The base URL of where the client makes requests.
     */
    baseUrl: string;
    /**
     * The underlying agent, from Superagent.
     */
    agent: superagent.SuperAgentStatic & superagent.Request
    /**
     * The cache module.
     * Any type, since the package used for caching doesn't provide
     */
    cache: any

    /**
     * Constructs a new API client.
     * @param baseUrl The base URL for requests made by this client.
     * @param useCache Whether or not to use caching
     */
    constructor(baseUrl: string, useCache = true) {
        // base constructions
        this.baseUrl = baseUrl;
        this.agent = superagent.agent();

        if (useCache) {
            // enable caching
            this.cache = new CacheModule({ defaultExpiration: 60 });
            this.agent.use(cachePlugin(this.cache));
        }
    }
    /**
     * Gets a URL based on the {@link BaseClient.baseUrl} and path specified.
     * Accepts query parameters.
     * 
     * @param path The path to append
     * @param params The query parameters
     */
    url(path: string, params: QueryParams): string {
        const url = new URL(path, this.baseUrl);
        for (const key of Object.keys(params)) {
            const value = params[key];
            if (value)
                url.searchParams.append(key, value.toString());
        }
        return url.toString();
    }

    request(method: HTTPMethod, path: string, queryParams: QueryParams): superagent.Request {
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
    get(path: string, queryParams: QueryParams = {}): superagent.Request {
        return this.request('GET', path, queryParams);
    }
    post(path: string, queryParams: QueryParams = {}): superagent.Request {
        return this.request('POST', path, queryParams);
    }
}