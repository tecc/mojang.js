import { BaseClient } from './BaseClient';
import type { NullValue } from './util';
import * as Util from './util';

export type PlayerNameData = {
    name: string;
    id: string;
}

export type PlayerNameHistoryEntry = {
    /**
     * Their name in this entry.
     */
    name: string;
    /**
     * When the player changed their username to {@link name}
     */
    changedToAt?: Date;
}
export type PlayerNameHistory = {
    uuid: string;
    history: PlayerNameHistoryEntry[];
    current: PlayerNameHistoryEntry;
}

/**
 * Mojang API client wrapper.
 * The specifications for the API this class wraps around is available at {@link https://wiki.vg/Mojang_API}
 */
export class Client extends BaseClient {
    /**
     * Constructs a new Mojang API client.
     */
    constructor() {
        super('https://api.mojang.com');
        this.agent.set('Content-Type', 'application/json');
    }

    /**
     * Gets a players UUID by their username.
     * You can choose when the username should've been used, instead of whoever as it now with this.
     * 
     * @param {string} username The username of the player to get the UUID for
     * @param {Date} at When this username should've been used for the UUID (please clarify)
     * @returns {Promise<PlayerNameData>} The player name data
     */
    getUuid(username: string, at?: Date): Promise<PlayerNameData> {
        return new Promise<PlayerNameData>((resolve, reject) => {
            let timestamp: number | NullValue = null;
            if (at) {
                timestamp = at.getTime() / 1000; // get rid of milliseconds
            }

            this.get('/users/profiles/minecraft/' + username, { at: timestamp })
                .then((response) => {
                    const data: PlayerNameData = response.body;
                    data.id = Util.expandUuid(data.id);
                    resolve(data);
                })
                .catch(reject);
        });
    }

    /**
     * Gets a list of UUIDs for 
     * @param {string[]} usernames The usernames to get their corresponding UUIDs for.
     * @returns {Promise<Map<string, PlayerNameData>>} A map of the players' usernames to their data object.
     */
    getUuids(usernames: string[]): Promise<Map<string, PlayerNameData>> {
        return new Promise<Map<string, PlayerNameData>>((resolve, reject) => {
            if (usernames.length > 10) {
                reject('A maximum of 10 usernames per request is enforced by Mojang.');
            }

            // send a request
            this.post('/profiles/minecraft')
                .send(usernames)
                .then((response) => {
                    const entries = response.body as PlayerNameData[];
                    const map = new Map<string, PlayerNameData>();
                    for (let i = 0; i < usernames.length; i++) {
                        const data = entries[i];
                        data.id = Util.expandUuid(data.id);
                        map.set(usernames[i], data);
                    }
                    resolve(map);
                })
                .catch(reject);
        });
    }

    /**
     * Gets a players name history by their UUID.
     * @param {string} uuid The UUID of the player to get the name history for.
     * @returns {Promise<PlayerNameHistory>} The players name history
     */
    getNameHistory(uuid: string): Promise<PlayerNameHistory> {
        return new Promise<PlayerNameHistory>(((resolve, reject) => {
            if (!Util.isUuid(uuid)) {
                throw new Error(`'uuid' parameter must be a valid UUID, got ${uuid}`);
            }

            this.get(`/user/profiles/${uuid}/names`)
                .then((response) => {
                    const history: PlayerNameHistoryEntry[] = response.body;
                    resolve({
                        uuid: Util.expandUuid(uuid),
                        current: history[history.length - 1],
                        history: history
                    });
                })
                .catch(reject);
        }));
    }
}