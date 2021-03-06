import { BaseClient } from './BaseClient';
import type { NullValue } from './util';
/**
 * Player name data.
 *
 * Provided by {@link Client.getUuid} and {@link Client.getUuids}.
 */
export declare type PlayerNameData = {
    name: string;
    id: string;
};
/**
 * Entry to {@link PlayerNameHistory}.
 *
 * Provided by {@link Client.getNameHistory}
 */
export declare type PlayerNameHistoryEntry = {
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
export declare type PlayerNameHistory = {
    id: string;
    history: PlayerNameHistoryEntry[];
    current: PlayerNameHistoryEntry;
};
export declare type PlayerProfileProperty = {
    name: string;
    value: any;
    signature?: string;
};
export declare type PlayerSkin = {
    slim: boolean;
    url: string;
};
export declare class PlayerProfile {
    id: string;
    name: string;
    properties: PlayerProfileProperty[];
    private textures;
    constructor(data: Partial<PlayerProfile>);
    getProperty(name: string): PlayerProfileProperty | NullValue;
    getSkin(): PlayerSkin | NullValue;
    getCape(): string | NullValue;
}
export declare type NameChangeResponse = {
    newName: string;
    id: string;
};
/**
 * Mojang API client wrapper.
 * The specifications for the API this class wraps around is available at {@link https://wiki.vg/Mojang_API}.
 *
 * @todo Most authenticated requests cannot yet be sent using this client.
 */
export declare class Client extends BaseClient {
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
