import { BaseClient } from './BaseClient';
import { rejects } from 'assert';
import { NullValue } from './util';
import * as Util from './util';
import crypto from 'crypto';

export interface YggdrasilError {
    error: string
    errorMessage: string
    cause?: string
}

type RefreshResponse = {
    user: {
        id: string
        properties: {name: 'preferredLanguage' | 'twitch_access_token', value: string}[]
    }
    clientToken: string
    accessToken: string
    selectedProfile: {
        name: string
        id: string
    }
}
type AuthenticationResponse = RefreshResponse & {
    user: {
        username: string,
        properties: {name: 'preferredLanguage' | 'registrationCountry', value: string}[]
    }
    availableProfiles: {
        name: string,
        id: string
    }[]
}

/**
 * Generates a client token. A client token has to be virtually impossible to be the same for any 2 clients.
 *
 * @param name The client name.
 * @param version The client version.
 * @param time The time.
 * @param number Random number.
 */
export function generateClientToken(
    name = 'mojang.js',
    version = Util.packageDetails.version,
    time = Date.now(),
    number = crypto.randomInt(0, 4294967296)
): string {
    const hash = crypto.createHash('sha512');
    hash.write(name.toString());
    hash.write(version.toString());
    hash.write(time.toString());
    hash.write(number.toString());
    return hash.digest().toString('hex');
}

export class Client extends BaseClient {
    private readonly clientToken: string
    private accessToken?: string

    /**
     * Constructs an instance of the Yggdrasil API wrapper.
     *
     * @param clientToken The client token to use. If not provided, it will be automatically generated.
     */
    constructor(clientToken: string = generateClientToken()) {
        super('https://authserver.mojang.com', false); // can't have caching for this
        this.agent.set('Content-Type', 'application/json');
        this.clientToken = clientToken;
    }

    /**
     * Gets the current access token that's used by default.
     */
    getAccessToken(): string | NullValue {
        return this.accessToken;
    }

    getClientToken(): string {
        return this.clientToken;
    }

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
    authenticate(username: string, password: string, use = true, clientToken = this.clientToken): Promise<AuthenticationResponse> {
        return new Promise((resolve, reject) => {
            this.post('/authenticate')
                .send({
                    agent: {
                        name: 'Minecraft',
                        version: 1
                    },
                    username: username,
                    password: password,
                    clientToken: clientToken,
                    requestUser: true
                })
                .then((response) => {
                    const res: AuthenticationResponse = response.body;
                    if (use) {
                        this.accessToken = res.accessToken;
                    }
                    resolve(res);
                })
                .catch(reject);
        });
    }

    /**
     * Validates an access token.
     * @param accessToken The access token to validate.
     * @param clientToken The client token to check against. If specified, it must match the one used to authenticate the access token in the first place.
     * @returns {Promise<boolean>} True if the access token is valid, false otherwise.
     */
    validateAccessToken(accessToken: string | NullValue = this.accessToken, clientToken: string | NullValue = this.clientToken): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!accessToken) reject('No access token specified!');
            else this.post('/validate')
                .ok((res) => res.status < 400 || res.status == 403)
                .send({
                    accessToken: accessToken,
                    clientToken: clientToken
                })
                .then((res) => {
                    if (res.noContent) resolve(true);
                    else if (res.forbidden) resolve(false);
                    else {
                        Util.warn('Response has a none-204 or 403 status code, automatically detecting.');
                        if (res.status < 400) resolve(true);
                        else resolve(false);
                    }
                })
                .catch(reject);
        });
    }

    /**
     * Refreshes an access token.
     * If the access token was authenticated with a different client token, it must be specified.
     *
     * @param accessToken The access token to refresh.
     * @param clientToken The client token used to authenticate the access token in the first place.
     *
     * @returns {Promise<RefreshResponse>} The refresh response.
     */
    refreshAccessToken(accessToken: string | NullValue = this.accessToken, clientToken: string = this.clientToken): Promise<RefreshResponse> {
        return new Promise<AuthenticationResponse>((resolve, reject) => {
            if (!accessToken) reject('No access token specified!');
            else this.post('/refresh')
                .send({
                    accessToken: accessToken,
                    clientToken: clientToken,
                    requestUser: true
                })
                .then((response) => {
                    resolve(response.body);
                })
                .catch(reject);
        });
    }

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
    signout(username: string, password: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.post('/signout')
                .send({
                    username: username,
                    password: password
                })
                .then((response) => {
                    if (!response.noContent) Util.warn('Response is not noContent');
                    resolve();
                })
                .catch(reject);
        });
    }

    /**
     * Invalidates an access token.
     *
     * @param accessToken The access token to invalidate.
     * @param clientToken The client token used to authenticate the access token in the first place.
     * @returns {Promise<void>} Nothing.
     */
    invalidateAccessToken(accessToken: string | NullValue = this.accessToken, clientToken: string = this.clientToken): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!accessToken) reject('No access token specified!');
            else this.post('/invalidate')
                .send({
                    accessToken: accessToken,
                    clientToken: clientToken
                })
                .then((response) => {
                    if (!response.noContent) Util.warn('Response is not noContent');
                    resolve();
                })
                .catch(reject);
        });
    }
}