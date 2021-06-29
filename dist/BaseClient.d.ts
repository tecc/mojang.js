import superagent from 'superagent';
import type { NullValue } from './util';
export declare type QueryParams = {
    [key: string]: string | number | NullValue;
};
export declare type HTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
export declare abstract class BaseClient {
    baseUrl: string;
    agent: superagent.SuperAgentStatic & superagent.Request;
    /**
     * Constructs a new API client.
     * @param baseUrl The base URL for requests made by this client.
     */
    constructor(baseUrl: string);
    /**
     * Gets a URL based on the {@link BaseClient.baseUrl} and path specified.
     * Accepts query parameters.
     *
     * @param path The path to append
     * @param params The query parameters
     */
    url(path: string, params: QueryParams): string;
    request(method: HTTPMethod, path: string, queryParams: QueryParams): superagent.Request;
    get(path: string, queryParams?: QueryParams): superagent.Request;
    post(path: string, queryParams?: QueryParams): superagent.Request;
}
