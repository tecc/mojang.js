import { BaseClient } from './BaseClient';
import type { NullValue } from './util';
import * as Util from './util';

export type PlayerNameData = {
    name: string,
    id: string
}

/**
 * Mojang API client wrapper.
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
     * @param username The username of the player to get the UUID for
     * @param at When this username should've been used for the UUID (please clarify)
     * @returns The player name data
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
     * @param usernames The usernames to get their corresponding UUIDs for.
     * @returns A map of the players' usernames to their data object. 
     */
    getUuids(usernames: string[]): Promise<Map<string, PlayerNameData>> {
        return new Promise<Map<string, PlayerNameData>>((resolve, reject) => {
            if (usernames.length > 10) {
                reject('A maximum of 10 usernames per request is enforced by Mojang.');
            }

            this.get('/users/profiles/minecraft')
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
}