import * as superagent from 'superagent';
import type { NullValue } from './util';

export type QueryParams = {[key: string]: string | number | NullValue};
export type HTTPMethod = 'GET' | 'PUT' | 'POST' | 'UPDATE' | 'DELETE' | 'PATCH' | 'HEAD'

export abstract class BaseClient {
    baseUrl: string;
    agent: superagent.SuperAgentStatic & superagent.Request

    /**
     * Constructs a new API client.
     * @param baseUrl The base URL for requests made by this client.
     */
    constructor(baseUrl: string) {
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
    url(path: string, params: QueryParams): string {
        const url = new URL(path, this.baseUrl);
        for (const key in params) {
            const value = params[key];
            if (value)
                url.searchParams.append(key, value.toString());
        }
        return url.toString();
    }

    request(method: HTTPMethod, path: string, queryParams: QueryParams) {
        return this.agent(method, this.url(path, queryParams));
    }
    get(path: string, queryParams: QueryParams = {}): superagent.Request {
        return this.request('GET', path, queryParams);
    }
    post(path: string, queryParams: QueryParams = {}): superagent.Request {
        return this.agent.post(this.url(path, queryParams));
    }
}