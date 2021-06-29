import { BaseClient } from './BaseClient';
export declare type PlayerNameData = {
    name: string;
    id: string;
};
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
export declare type PlayerNameHistory = {
    uuid: string;
    history: PlayerNameHistoryEntry[];
    current: PlayerNameHistoryEntry;
};
/**
 * Mojang API client wrapper.
 * The specifications for the API this class wraps around is available at {@link https://wiki.vg/Mojang_API}
 */
export declare class Client extends BaseClient {
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
    /**
     * Gets a players name history by their UUID.
     * @param {string} uuid The UUID of the player to get the name history for.
     * @returns {Promise<PlayerNameHistory>} The players name history
     */
    getNameHistory(uuid: string): Promise<PlayerNameHistory>;
}
