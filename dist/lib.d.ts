declare module '@tecc/mojang.js/BaseClient' {
    import superagent from 'superagent';
    import type { NullValue } from '@tecc/mojang.js/util';
    export type QueryParams = {
        [key: string]: string | number | NullValue;
    };
    export type HTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
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
    
}
declare module '@tecc/mojang.js' {
    export * as Base from '@tecc/mojang.js/BaseClient';
    export * as Mojang from '@tecc/mojang.js/mojang';
    export { Client as MojangClient } from '@tecc/mojang.js/mojang';
    export * as Yggdrasil from '@tecc/mojang.js/yggdrasil';
    export { Client as YggdrasilClient } from '@tecc/mojang.js/yggdrasil';
    export * as Util from '@tecc/mojang.js/util';
    
}
declare module '@tecc/mojang.js/mojang' {
    import { BaseClient } from '@tecc/mojang.js/BaseClient';
    import type { NullValue } from '@tecc/mojang.js/util';
    /**
     * Player name data.
     *
     * Provided by {@link Client.getUuid} and {@link Client.getUuids}.
     */
    export type PlayerNameData = {
        name: string;
        id: string;
    };
    /**
     * Entry to {@link PlayerNameHistory}.
     */
    export type PlayerNameHistoryEntry = {
        /**
         * Their name in this entry.
         */
        name: string;
        /**
         * When the player changed their username to {@link name}
         */
        changedToAt?: Date;
    };
    /**
     * Player name history.
     *
     * Provided by {@link Client.getNameHistory}.
     */
    export type PlayerNameHistory = {
        id: string;
        history: PlayerNameHistoryEntry[];
        current: PlayerNameHistoryEntry;
    };
    export type PlayerProfileProperty = {
        name: string;
        value: any;
        signature?: string;
    };
    export type PlayerSkin = {
        slim: boolean;
        url: string;
    };
    export class PlayerProfile {
        id: string;
        name: string;
        properties: PlayerProfileProperty[];
        private textures;
        constructor(data: Partial<PlayerProfile>);
        getProperty(name: string): PlayerProfileProperty | NullValue;
        getSkin(): PlayerSkin | NullValue;
        getCape(): string | NullValue;
    }
    /**
     * Mojang API client wrapper.
     * The specifications for the API this class wraps around is available at {@link https://wiki.vg/Mojang_API}.
     */
    export class Client extends BaseClient {
        /**
         * Constructs a new {@link Client Mojang API} client.
         */
        constructor();
        /**
         * Gets a players UUID by their username.
         * You can choose when the username should've been used, instead of whoever as it now with this.
         *
         * @param {string} username The username of the player to get the UUID for
         * @param {Date} at When this username should've been used for the UUID (please clarify)
         * @returns {Promise<PlayerNameData>} The player name data
         */
        getUuid(username: string, at?: Date): Promise<PlayerNameData>;
        /**
         * Gets a list of UUIDs for
         * @param {string[]} usernames The usernames to get their corresponding UUIDs for.
         * @returns {Promise<Map<string, PlayerNameData>>} A map of the players' usernames to their data object.
         */
        getUuids(usernames: string[]): Promise<Map<string, PlayerNameData>>;
        /**
         * Gets a players name history by their UUID.
         * @param {string} uuid The UUID of the player to get the name history for.
         * @returns {Promise<PlayerNameHistory>} The players name history
         */
        getNameHistory(uuid: string): Promise<PlayerNameHistory>;
        getProfile(uuid: string): Promise<PlayerProfile>;
    }
    
}
declare module '@tecc/mojang.js/util' {
    export type NullValue = undefined | null;
    export type PackageDetails = {
        version: string;
    };
    export const packageDetails: PackageDetails;
    export function isUuid(uuid: string): boolean;
    export function cleanUuid(uuid: string): string;
    export function expandUuid(uuid: string): string;
    export function base64Decode(data: string): string;
    export function base64encode(data: any): string;
    
}
declare module '@tecc/mojang.js/yggdrasil' {
    import { BaseClient } from '@tecc/mojang.js/BaseClient';
    export class Client extends BaseClient {
        constructor();
    }
    
}