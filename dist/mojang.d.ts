import { BaseClient } from './BaseClient';
export declare type PlayerNameData = {
    name: string;
    id: string;
};
/**
 * Mojang API client wrapper.
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
}
