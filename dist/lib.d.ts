declare module 'mojang.js/BaseClient' {
    import * as superagent from 'superagent';
    import type { NullValue } from 'mojang.js/util';
    export type QueryParams = {
        [key: string]: string | number | NullValue;
    };
    export type HTTPMethod = 'GET' | 'PUT' | 'POST' | 'UPDATE' | 'DELETE' | 'PATCH' | 'HEAD';
    export abstract class BaseClient {
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
        request(method: HTTPMethod, path: string, queryParams: QueryParams): superagent.SuperAgentRequest;
        get(path: string, queryParams?: QueryParams): superagent.Request;
        post(path: string, queryParams?: QueryParams): superagent.Request;
    }
    
}
declare module 'mojang.js' {
    export * as Base from 'mojang.js/BaseClient';
    export * as Mojang from 'mojang.js/mojang';
    export { MojangClient } from 'mojang.js/mojang';
    export * as Yggdrasil from 'mojang.js/yggdrasil';
    export { YggdrasilClient } from 'mojang.js/yggdrasil';
    export * as Util from 'mojang.js/util';
    
}
declare module 'mojang.js/mojang' {
    import { BaseClient } from 'mojang.js/BaseClient';
    export type PlayerNameData = {
        name: string;
        id: string;
    };
    /**
     * Mojang API client wrapper.
     */
    export class MojangClient extends BaseClient {
        /**
         * Constructs a new Mojang API client.
         */
        constructor();
        /**
         * Gets a players UUID by their username.
         * You can choose when the username should've been used, instead of whoever as it now with this.
         *
         * @param username The username of the player to get the UUID for
         * @param at When this username should've been used for the UUID (please clarify)
         * @returns The player name data
         */
        getUuid(username: string, at?: Date): Promise<PlayerNameData>;
        /**
         * Gets a list of UUIDs for
         * @param usernames The usernames to get their corresponding UUIDs for.
         * @returns A map of the players' usernames to their data object.
         */
        getUuids(usernames: string[]): Promise<Map<string, PlayerNameData>>;
    }
    
}
declare module 'mojang.js/util' {
    export type NullValue = undefined | null;
    export function validate(uuid: string): boolean;
    export function cleanUuid(uuid: string): string;
    export function expandUuid(uuid: string): string;
    
}
declare module 'mojang.js/yggdrasil' {
    export class YggdrasilClient {
    }
    
}