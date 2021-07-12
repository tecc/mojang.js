import { BaseClient } from './BaseClient';
import type { NullValue } from './util';
import * as Util from './util';

/**
 * Player name data.
 *
 * Provided by {@link Client.getUuid} and {@link Client.getUuids}.
 */
export type PlayerNameData = {
    name: string;
    id: string;
}

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
}
/**
 * Player name history.
 *
 * Provided by {@link Client.getNameHistory}.
 */
export type PlayerNameHistory = {
    id: string;
    history: PlayerNameHistoryEntry[];
    current: PlayerNameHistoryEntry;
}

export type PlayerProfileProperty = {
    name: string;
    value: any;
    signature?: string;
}
type _PlayerTexturesObj = {
    timestamp: number;
    profileId: string;
    profileName: string;
    signatureRequired?: boolean;
    textures: {
        SKIN?: {
            url: string
            metadata?: {
                model: 'slim'
            }
        },
        CAPE?: {
            url: string
        }
    }
}
export type PlayerSkin = {
    slim: boolean;
    url: string;
}
export class PlayerProfile {
    id: string;
    name: string;
    properties: PlayerProfileProperty[];
    private textures: _PlayerTexturesObj;

    constructor(data: Partial<PlayerProfile>) {
        if (!data) throw new Error('Player profile data cannot be null!');
        this.id = data.id!;
        this.name = data.name!;
        this.properties = data.properties!;

        // textures
        const prop = this.getProperty('textures');
        if (prop == undefined) throw new Error('Profile property textures is null');
        this.textures = JSON.parse(Util.base64Decode(prop.value));
    }

    getProperty(name: string): PlayerProfileProperty | NullValue {
        for (const property of this.properties) {
            if (property.name == name) {
                return property;
            }
        }
        return null;
    }

    getSkin(): PlayerSkin | NullValue {
        const source = this.textures.textures.SKIN;
        return source ? {
            slim: source.metadata ? source.metadata.model == 'slim' : false,
            url: source.url
        } : null;
    }
    getCape(): string | NullValue {
        const source = this.textures.textures.CAPE;
        return source ? source.url : null;
    }
}

/**
 * Mojang API client wrapper.
 * The specifications for the API this class wraps around is available at {@link https://wiki.vg/Mojang_API}.
 */
export class Client extends BaseClient {
    private accessToken?: string
    /**
     * Constructs a new {@link Client Mojang API} client.
     */
    constructor(accessToken?: string) {
        super('https://api.mojang.com');
        this.agent.set('Content-Type', 'application/json');
        if (accessToken) this.setAccessToken(accessToken);
    }

    setAccessToken(accessToken: string): void {
        this.accessToken = accessToken;
        this.agent.auth(accessToken, {type: 'bearer'});
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
                    const history: PlayerNameHistoryEntry[] = response.body.map((improper: any) => {
                        const entry: PlayerNameHistoryEntry = {
                            name: improper.name,
                            changedToAt: improper.changedToAt != undefined ? new Date(improper.changedToAt) : undefined
                        };
                        return entry;
                    });
                    resolve({
                        id: Util.expandUuid(uuid),
                        current: history[history.length - 1],
                        history: history
                    });
                })
                .catch(reject);
        }));
    }

    /**
     * Gets a players' profile.
     * @param uuid The UUID of the player to get the profile of.
     */
    getProfile(uuid: string): Promise<PlayerProfile> {
        return new Promise<PlayerProfile>((resolve, reject) => {
            this.agent.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
                .then((response) => {
                    const profile: PlayerProfile = new PlayerProfile(response.body);
                    resolve(profile);
                })
                .catch(reject);
        });
    }

    /**
     * Gets the servers that Mojang has blocked.
     * @returns {Promise<string[]>} A list of SHA1 hashes for the hostnames that Mojang have blocked.
     */
    getBlockedServers(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            this.agent.get('https://sessionserver.mojang.com/blockedservers')
                .then((response) => {
                    resolve(response.text.split(/\s/g));
                })
                .catch(reject);
        });
    }

    // BEYOND THIS POINT LIES ENDPOINTS THAT REQUIRE AUTHENTICATION

    /**
     * Checks if a name is available.
     *
     * > **NOTE**<br>
     * > This method requires the access token to be set.
     *
     * @param name The name to check.
     */
    isNameAvailable(name: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.agent.get(`https://api.minecraftservices.com/minecraft/profile/name/${name}/available`)
                .then((response) => {
                    resolve(response.body.status == 'AVAILABLE');
                })
                .catch(reject);
        });
    }
}