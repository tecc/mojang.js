import superagent from 'superagent';
import type { NullValue } from './util';
export declare type QueryParams = {
    [key: string]: string | number | NullValue;
};
export declare type HTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
export declare abstract class BaseClient {
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
    private defaultAuth;
    /**
     * Constructs a new API client.
     * @param baseUrl The base URL for requests made by this client.
     * @param useCache Whether or not to use caching
     * @param defaultAuth The default authorisation token to use.
     */
    constructor(baseUrl: string, useCache?: boolean, defaultAuth?: () => string | NullValue);
    /**
     * Gets a URL based on the {@link BaseClient.baseUrl} and path specified.
     * Accepts query parameters.
     *
     * @param path The path to append
     * @param params The query parameters
     */
    url(path: string, params: QueryParams): string;
    request(method: HTTPMethod, path: string, queryParams: QueryParams, auth?: string | NullValue): superagent.Request;
    get(path: string, queryParams?: QueryParams, auth?: string | NullValue): superagent.Request;
    post(path: string, queryParams?: QueryParams, auth?: string | NullValue): superagent.Request;
    put(path: string, queryParams?: QueryParams, auth?: string | NullValue): superagent.Request;
}
