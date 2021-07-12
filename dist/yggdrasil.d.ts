import { BaseClient } from './BaseClient';
import { NullValue } from './util';
export interface YggdrasilError {
    error: string;
    errorMessage: string;
    cause?: string;
}
declare type RefreshResponse = {
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
declare type AuthenticationResponse = RefreshResponse & {
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
export declare function generateClientToken(name?: string, version?: string, time?: number, number?: number): string;
export declare class Client extends BaseClient {
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
