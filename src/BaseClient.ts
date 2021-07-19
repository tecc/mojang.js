import superagent from 'superagent';
// no type definitions
// @ts-ignore
import cachePlugin from 'superagent-cache-plugin';
// @ts-ignore
import CacheModule from 'cache-service-cache-module';

import type { NullValue } from './util';
import * as Util from './util';

export type QueryParams = { [key: string]: string | number | NullValue };
export type HTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

export abstract class BaseClient {
    /**
     * The base URL of where the client makes requests.
     */
    baseUrl: string;
    /**
     * The underlying agent, from Superagent.
     */
    agent: superagent.SuperAgentStatic & superagent.Request;
    /**
     * The cache module.
     * Any type, since the package used for caching doesn't provide
     */
    cache: any;

    private defaultAuth: () => string | NullValue

    /**
     * Constructs a new API client.
     * @param baseUrl The base URL for requests made by this client.
     * @param useCache Whether or not to use caching
     * @param defaultAuth The default authorisation token to use.
     */
    constructor(baseUrl: string, useCache = true, defaultAuth?: () => string | NullValue) {
        // base constructions
        this.baseUrl = baseUrl;
        this.agent = superagent.agent();

        if (useCache) {
            // enable caching
            this.cache = new CacheModule({defaultExpiration: 60});
            this.agent.use(cachePlugin(this.cache));
        }

        if (defaultAuth) {
            // has default authorisation
            this.defaultAuth = defaultAuth;
        } else {
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
    url(path: string, params: QueryParams): string {
        const url = new URL(path, this.baseUrl);
        for (const key of Object.keys(params)) {
            const value = params[key];
            if (value)
                url.searchParams.append(key, value.toString());
        }
        return url.toString();
    }

    request(method: HTTPMethod, path: string, queryParams: QueryParams, auth: string | NullValue = this.defaultAuth()): superagent.Request {
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
        if (auth) req = req.auth(auth, { type: 'bearer' });
        return req;
    }

    get(path: string, queryParams: QueryParams = {}, auth: string | NullValue = this.defaultAuth()): superagent.Request {
        return this.request('GET', path, queryParams, auth);
    }

    post(path: string, queryParams: QueryParams = {}, auth: string | NullValue = this.defaultAuth()): superagent.Request {
        return this.request('POST', path, queryParams, auth);
    }

    put(path: string, queryParams: QueryParams = {}, auth: string | NullValue = this.defaultAuth()): superagent.Request {
        return this.request('PUT', path, queryParams, auth);
    }
}