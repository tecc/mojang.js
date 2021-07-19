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
     *
     * Provided by {@link Client.getNameHistory}
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
    export type NameChangeResponse = {
        newName: string;
        id: string;
    };
    /**
     * Mojang API client wrapper.
     * The specifications for the API this class wraps around is available at {@link https://wiki.vg/Mojang_API}.
     *
     * @todo Most authenticated requests cannot yet be sent using this client.
     */
    export class Client extends BaseClient {
        private accessToken?;
        /**
         * Constructs a new {@link Client Mojang API} client.
         */
        constructor(accessToken?: string);
        setAccessToken(accessToken: string): void;
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
        /**
         * Gets a players' profile.
         * @param uuid The UUID of the player to get the profile of.
         */
        getProfile(uuid: string): Promise<PlayerProfile>;
        /**
         * Gets the servers that Mojang has blocked.
         * @returns {Promise<string[]>} A list of SHA1 hashes for the hostnames that Mojang have blocked.
         */
        getBlockedServers(): Promise<string[]>;
        /**
         * Checks if a name is available.
         *
         * > **NOTE**<br>
         * > This method requires the access token to be set.
         *
         * @param name The name to check.
         * @param accessToken The access token to use. If unspecified, defaults to the clients access token.
         */
        isNameAvailable(name: string, accessToken?: string | NullValue): Promise<boolean>;
        /**
         * Changes the name of the access tokens corresponding user.
         *
         * @param name The name to change to.
         * @param accessToken The access token of the player to change the name of. If unspecified, defaults to the clients access token.
         */
        changeName(name: string, accessToken?: string | NullValue): Promise<NameChangeResponse>;
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
    export function base64Encode(data: any): string;
    export function warn(...msg: any): void;
    
}
declare module '@tecc/mojang.js/yggdrasil' {
    import { BaseClient } from '@tecc/mojang.js/BaseClient';
    import { NullValue } from '@tecc/mojang.js/util';
    export interface YggdrasilError {
        error: string;
        errorMessage: string;
        cause?: string;
    }
    type RefreshResponse = {
        user: {
            id: string;
            properties: {
                name: 'preferredLanguage' | 'twitch_access_token';
                value: string;
            }[];
        };
        clientToken: string;
        accessToken: string;
        selectedProfile: {
            name: string;
            id: string;
        };
    };
    type AuthenticationResponse = RefreshResponse & {
        user: {
            username: string;
            properties: {
                name: 'preferredLanguage' | 'registrationCountry';
                value: string;
            }[];
        };
        availableProfiles: {
            name: string;
            id: string;
        }[];
    };
    /**
     * Generates a client token. A client token has to be virtually impossible to be the same for any 2 clients.
     *
     * @param name The client name.
     * @param version The client version.
     * @param time The time.
     * @param number Random number.
     */
    export function generateClientToken(name?: string, version?: string, time?: number, number?: number): string;
    export class Client extends BaseClient {
        private readonly clientToken;
        private accessToken?;
        /**
         * Constructs an instance of the Yggdrasil API wrapper.
         *
         * @param clientToken The client token to use. If not provided, it will be automatically generated.
         */
        constructor(clientToken?: string);
        /**
         * Gets the current access token that's used by default.
         */
        getAccessToken(): string | NullValue;
        getClientToken(): string;
        /**
         * Authenticates this client.
         *
         * @param username The username for the
         * @param password The password
         * @param use Whether or not to set this clients tokens to the tokens from the response.
         * @param clientToken The client token to use. This is automatically set by mojang.js, and is not recommended to specify manually.
         *
         * @returns {Promise<AuthenticationResponse>} The raw response from the API.
         * @todo Make the raw response more fit for the end user.
         */
        authenticate(username: string, password: string, use?: boolean, clientToken?: string): Promise<AuthenticationResponse>;
        /**
         * Validates an access token.
         * @param accessToken The access token to validate.
         * @param clientToken The client token to check against. If specified, it must match the one used to authenticate the access token in the first place.
         * @returns {Promise<boolean>} True if the access token is valid, false otherwise.
         */
        validateAccessToken(accessToken?: string | NullValue, clientToken?: string | NullValue): Promise<boolean>;
        /**
         * Refreshes an access token.
         * If the access token was authenticated with a different client token, it must be specified.
         *
         * @param accessToken The access token to refresh.
         * @param clientToken The client token used to authenticate the access token in the first place.
         *
         * @returns {Promise<RefreshResponse>} The refresh response.
         */
        refreshAccessToken(accessToken?: string | NullValue, clientToken?: string): Promise<RefreshResponse>;
        /**
         * Invalidates all access tokens for an account.
         *
         * > **NOTE**<br>
         * > This may cause an inconvenience to the user. Use with care.
         * > To invalidate a single access token, use {@link Client.invalidateAccessToken}
         *
         * @see Client.invalidateAccessToken
         *
         * @param username The username of the player to sign out.
         * @param password The password of the player to sign out.
         * @returns {Promise<void>} Nothing.
         */
        signout(username: string, password: string): Promise<void>;
        /**
         * Invalidates an access token.
         *
         * @param accessToken The access token to invalidate.
         * @param clientToken The client token used to authenticate the access token in the first place.
         * @returns {Promise<void>} Nothing.
         */
        invalidateAccessToken(accessToken?: string | NullValue, clientToken?: string): Promise<void>;
    }
    export {};
    
}