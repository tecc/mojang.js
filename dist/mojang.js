"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.PlayerProfile = void 0;
const BaseClient_1 = require("./BaseClient");
const Util = __importStar(require("./util"));
class PlayerProfile {
    constructor(data) {
        if (!data)
            throw new Error('Player profile data cannot be null!');
        this.id = data.id;
        this.name = data.name;
        this.properties = data.properties;
        // textures
        const prop = this.getProperty('textures');
        if (prop == undefined)
            throw new Error('Profile property textures is null');
        this.textures = JSON.parse(Util.base64Decode(prop.value));
    }
    getProperty(name) {
        for (const property of this.properties) {
            if (property.name == name) {
                return property;
            }
        }
        return null;
    }
    getSkin() {
        const source = this.textures.textures.SKIN;
        return source ? {
            slim: source.metadata ? source.metadata.model == 'slim' : false,
            url: source.url
        } : null;
    }
    getCape() {
        const source = this.textures.textures.CAPE;
        return source ? source.url : null;
    }
}
exports.PlayerProfile = PlayerProfile;
/**
 * Mojang API client wrapper.
 * The specifications for the API this class wraps around is available at {@link https://wiki.vg/Mojang_API}.
 *
 * @todo Most authenticated requests cannot yet be sent using this client.
 */
class Client extends BaseClient_1.BaseClient {
    /**
     * Constructs a new {@link Client Mojang API} client.
     */
    constructor(accessToken) {
        super('https://api.mojang.com', true, () => this.accessToken);
        this.agent.set('Content-Type', 'application/json');
        if (accessToken)
            this.setAccessToken(accessToken);
    }
    setAccessToken(accessToken) {
        this.accessToken = accessToken;
    }
    /**
     * Gets a players UUID by their username.
     * You can choose when the username should've been used, instead of whoever as it now with this.
     *
     * @param {string} username The username of the player to get the UUID for
     * @param {Date} at When this username should've been used for the UUID (please clarify)
     * @returns {Promise<PlayerNameData>} The player name data
     */
    getUuid(username, at) {
        return new Promise((resolve, reject) => {
            let timestamp = null;
            if (at) {
                timestamp = at.getTime() / 1000; // get rid of milliseconds
            }
            this.get(`/users/profiles/minecraft/${username}`, { at: timestamp })
                .then((response) => {
                const data = response.body;
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
    getUuids(usernames) {
        return new Promise((resolve, reject) => {
            if (usernames.length > 10) {
                reject('A maximum of 10 usernames per request is enforced by Mojang.');
            }
            // send a request
            this.post('/profiles/minecraft')
                .send(usernames)
                .then((response) => {
                const entries = response.body;
                const map = new Map();
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
    getNameHistory(uuid) {
        return new Promise(((resolve, reject) => {
            if (!Util.isUuid(uuid)) {
                throw new Error(`'uuid' parameter must be a valid UUID, got ${uuid}`);
            }
            this.get(`/user/profiles/${uuid}/names`)
                .then((response) => {
                const history = response.body.map((improper) => {
                    const entry = {
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
    getProfile(uuid) {
        return new Promise((resolve, reject) => {
            this.agent.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
                .then((response) => {
                const profile = new PlayerProfile(response.body);
                resolve(profile);
            })
                .catch(reject);
        });
    }
    /**
     * Gets the servers that Mojang has blocked.
     * @returns {Promise<string[]>} A list of SHA1 hashes for the hostnames that Mojang have blocked.
     */
    getBlockedServers() {
        return new Promise((resolve, reject) => {
            this.get('https://sessionserver.mojang.com/blockedservers')
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
     * @param accessToken The access token to use. If unspecified, defaults to the clients access token.
     */
    isNameAvailable(name, accessToken = this.accessToken) {
        return new Promise((resolve, reject) => {
            if (!accessToken) {
                reject('isNameAvailable requires an access token!');
                return;
            }
            this.get(`https://api.minecraftservices.com/minecraft/profile/name/${name}/available`)
                .then((response) => {
                resolve(response.body.status == 'AVAILABLE');
            })
                .catch(reject);
        });
    }
    /**
     * Changes the name of the access tokens corresponding user.
     *
     * @param name The name to change to.
     * @param accessToken The access token of the player to change the name of. If unspecified, defaults to the clients access token.
     */
    changeName(name, accessToken = this.accessToken) {
        return new Promise((resolve, reject) => {
            if (!accessToken) {
                reject('changeName requires an access token!');
                return;
            }
            this.put(`https://api.minecraftservices.com/minecraft/profile/name/${name}`)
                .then((response) => {
                const body = response.body;
                resolve({
                    newName: body.name,
                    id: body.skins[0].id
                });
            })
                .catch(reject);
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9qYW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vamFuZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQXNEO0FBRXRELDZDQUErQjtBQWlFL0IsTUFBYSxhQUFhO0lBTXRCLFlBQVksSUFBNEI7UUFDcEMsSUFBSSxDQUFDLElBQUk7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFXLENBQUM7UUFFbkMsV0FBVztRQUNYLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUMsSUFBSSxJQUFJLElBQUksU0FBUztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsV0FBVyxDQUFDLElBQVk7UUFDcEIsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BDLElBQUksUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7Z0JBQ3ZCLE9BQU8sUUFBUSxDQUFDO2FBQ25CO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsT0FBTztRQUNILE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUMzQyxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFD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cm9tICcuL0Jhc2VDbGllbnQnO1xuaW1wb3J0IHR5cGUgeyBOdWxsVmFsdWUgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0ICogYXMgVXRpbCBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHN1cGVyYWdlbnQgZnJvbSAnc3VwZXJhZ2VudCc7XG5cbi8qKlxuICogUGxheWVyIG5hbWUgZGF0YS5cbiAqXG4gKiBQcm92aWRlZCBieSB7QGxpbmsgQ2xpZW50LmdldFV1aWR9IGFuZCB7QGxpbmsgQ2xpZW50LmdldFV1aWRzfS5cbiAqL1xuZXhwb3J0IHR5cGUgUGxheWVyTmFtZURhdGEgPSB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRW50cnkgdG8ge0BsaW5rIFBsYXllck5hbWVIaXN0b3J5fS5cbiAqXG4gKiBQcm92aWRlZCBieSB7QGxpbmsgQ2xpZW50LmdldE5hbWVIaXN0b3J5fVxuICovXG5leHBvcnQgdHlwZSBQbGF5ZXJOYW1lSGlzdG9yeUVudHJ5ID0ge1xuICAgIC8qKlxuICAgICAqIFRoZWlyIG5hbWUgaW4gdGhpcyBlbnRyeS5cbiAgICAgKi9cbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogV2hlbiB0aGUgcGxheWVyIGNoYW5nZWQgdGhlaXIgdXNlcm5hbWUgdG8ge0BsaW5rIG5hbWV9XG4gICAgICovXG4gICAgY2hhbmdlZFRvQXQ/OiBEYXRlO1xufVxuLyoqXG4gKiBQbGF5ZXIgbmFtZSBoaXN0b3J5LlxuICpcbiAqIFByb3ZpZGVkIGJ5IHtAbGluayBDbGllbnQuZ2V0TmFtZUhpc3Rvcnl9LlxuICovXG5leHBvcnQgdHlwZSBQbGF5ZXJOYW1lSGlzdG9yeSA9IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIGhpc3Rvcnk6IFBsYXllck5hbWVIaXN0b3J5RW50cnlbXTtcbiAgICBjdXJyZW50OiBQbGF5ZXJOYW1lSGlzdG9yeUVudHJ5O1xufVxuXG5leHBvcnQgdHlwZSBQbGF5ZXJQcm9maWxlUHJvcGVydHkgPSB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHZhbHVlOiBhbnk7XG4gICAgc2lnbmF0dXJlPzogc3RyaW5nO1xufVxudHlwZSBfUGxheWVyVGV4dHVyZXNPYmogPSB7XG4gICAgdGltZXN0YW1wOiBudW1iZXI7XG4gICAgcHJvZmlsZUlkOiBzdHJpbmc7XG4gICAgcHJvZmlsZU5hbWU6IHN0cmluZztcbiAgICBzaWduYXR1cmVSZXF1aXJlZD86IGJvb2xlYW47XG4gICAgdGV4dHVyZXM6IHtcbiAgICAgICAgU0tJTj86IHtcbiAgICAgICAgICAgIHVybDogc3RyaW5nXG4gICAgICAgICAgICBtZXRhZGF0YT86IHtcbiAgICAgICAgICAgICAgICBtb2RlbDogJ3NsaW0nXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIENBUEU/OiB7XG4gICAgICAgICAgICB1cmw6IHN0cmluZ1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IHR5cGUgUGxheWVyU2tpbiA9IHtcbiAgICBzbGltOiBib29sZWFuO1xuICAgIHVybDogc3RyaW5nO1xufVxuZXhwb3J0IGNsYXNzIFBsYXllclByb2ZpbGUge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHByb3BlcnRpZXM6IFBsYXllclByb2ZpbGVQcm9wZXJ0eVtdO1xuICAgIHByaXZhdGUgdGV4dHVyZXM6IF9QbGF5ZXJUZXh0dXJlc09iajtcblxuICAgIGNvbnN0cnVjdG9yKGRhdGE6IFBhcnRpYWw8UGxheWVyUHJvZmlsZT4pIHtcbiAgICAgICAgaWYgKCFkYXRhKSB0aHJvdyBuZXcgRXJyb3IoJ1BsYXllciBwcm9maWxlIGRhdGEgY2Fubm90IGJlIG51bGwhJyk7XG4gICAgICAgIHRoaXMuaWQgPSBkYXRhLmlkITtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lITtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gZGF0YS5wcm9wZXJ0aWVzITtcblxuICAgICAgICAvLyB0ZXh0dXJlc1xuICAgICAgICBjb25zdCBwcm9wID0gdGhpcy5nZXRQcm9wZXJ0eSgndGV4dHVyZXMnKTtcbiAgICAgICAgaWYgKHByb3AgPT0gdW5kZWZpbmVkKSB0aHJvdyBuZXcgRXJyb3IoJ1Byb2ZpbGUgcHJvcGVydHkgdGV4dHVyZXMgaXMgbnVsbCcpO1xuICAgICAgICB0aGlzLnRleHR1cmVzID0gSlNPTi5wYXJzZShVdGlsLmJhc2U2NERlY29kZShwcm9wLnZhbHVlKSk7XG4gICAgfVxuXG4gICAgZ2V0UHJvcGVydHkobmFtZTogc3RyaW5nKTogUGxheWVyUHJvZmlsZVByb3BlcnR5IHwgTnVsbFZhbHVlIHtcbiAgICAgICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiB0aGlzLnByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5uYW1lID09IG5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0U2tpbigpOiBQbGF5ZXJTa2luIHwgTnVsbFZhbHVlIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gdGhpcy50ZXh0dXJlcy50ZXh0dXJlcy5TS0lOO1xuICAgICAgICByZXR1cm4gc291cmNlID8ge1xuICAgICAgICAgICAgc2xpbTogc291cmNlLm1ldGFkYXRhID8gc291cmNlLm1ldGFkYXRhLm1vZGVsID09ICdzbGltJyA6IGZhbHNlLFxuICAgICAgICAgICAgdXJsOiBzb3VyY2UudXJsXG4gICAgICAgIH0gOiBudWxsO1xuICAgIH1cbiAgICBnZXRDYXBlKCk6IHN0cmluZyB8IE51bGxWYWx1ZSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMudGV4dHVyZXMudGV4dHVyZXMuQ0FQRTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZSA/IHNvdXJjZS51cmwgOiBudWxsO1xuICAgIH1cbn1cblxuZXhwb3J0IHR5cGUgTmFtZUNoYW5nZVJlc3BvbnNlID0ge1xuICAgIG5ld05hbWU6IHN0cmluZyxcbiAgICBpZDogc3RyaW5nXG59O1xuXG4vKipcbiAqIE1vamFuZyBBUEkgY2xpZW50IHdyYXBwZXIuXG4gKiBUaGUgc3BlY2lmaWNhdGlvbnMgZm9yIHRoZSBBUEkgdGhpcyBjbGFzcyB3cmFwcyBhcm91bmQgaXMgYXZhaWxhYmxlIGF0IHtAbGluayBodHRwczovL3dpa2kudmcvTW9qYW5nX0FQSX0uXG4gKlxuICogQHRvZG8gTW9zdCBhdXRoZW50aWNhdGVkIHJlcXVlc3RzIGNhbm5vdCB5ZXQgYmUgc2VudCB1c2luZyB0aGlzIGNsaWVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIENsaWVudCBleHRlbmRzIEJhc2VDbGllbnQge1xuICAgIHByaXZhdGUgYWNjZXNzVG9rZW4/OiBzdHJpbmdcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGEgbmV3IHtAbGluayBDbGllbnQgTW9qYW5nIEFQSX0gY2xpZW50LlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGFjY2Vzc1Rva2VuPzogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKCdodHRwczovL2FwaS5tb2phbmcuY29tJywgdHJ1ZSwgKCkgPT4gdGhpcy5hY2Nlc3NUb2tlbik7XG4gICAgICAgIHRoaXMuYWdlbnQuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICBpZiAoYWNjZXNzVG9rZW4pIHRoaXMuc2V0QWNjZXNzVG9rZW4oYWNjZXNzVG9rZW4pO1xuICAgIH1cblxuICAgIHNldEFjY2Vzc1Rva2VuKGFjY2Vzc1Rva2VuOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IGFjY2Vzc1Rva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBwbGF5ZXJzIFVVSUQgYnkgdGhlaXIgdXNlcm5hbWUuXG4gICAgICogWW91IGNhbiBjaG9vc2Ugd2hlbiB0aGUgdXNlcm5hbWUgc2hvdWxkJ3ZlIGJlZW4gdXNlZCwgaW5zdGVhZCBvZiB3aG9ldmVyIGFzIGl0IG5vdyB3aXRoIHRoaXMuXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIFRoZSB1c2VybmFtZSBvZiB0aGUgcGxheWVyIHRvIGdldCB0aGUgVVVJRCBmb3JcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGF0IFdoZW4gdGhpcyB1c2VybmFtZSBzaG91bGQndmUgYmVlbiB1c2VkIGZvciB0aGUgVVVJRCAocGxlYXNlIGNsYXJpZnkpXG4gICAgICogQHJldHVybnMge1Byb21pc2U8UGxheWVyTmFtZURhdGE+fSBUaGUgcGxheWVyIG5hbWUgZGF0YVxuICAgICAqL1xuICAgIGdldFV1aWQodXNlcm5hbWU6IHN0cmluZywgYXQ/OiBEYXRlKTogUHJvbWlzZTxQbGF5ZXJOYW1lRGF0YT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8UGxheWVyTmFtZURhdGE+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCB0aW1lc3RhbXA6IG51bWJlciB8IE51bGxWYWx1ZSA9IG51bGw7XG4gICAgICAgICAgICBpZiAoYXQpIHtcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXAgPSBhdC5nZXRUaW1lKCkgLyAxMDAwOyAvLyBnZXQgcmlkIG9mIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdldChgL3VzZXJzL3Byb2ZpbGVzL21pbmVjcmFmdC8ke3VzZXJuYW1lfWAsIHsgYXQ6IHRpbWVzdGFtcCB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhOiBQbGF5ZXJOYW1lRGF0YSA9IHJlc3BvbnNlLmJvZHk7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaWQgPSBVdGlsLmV4cGFuZFV1aWQoZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGxpc3Qgb2YgVVVJRHMgZm9yIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IHVzZXJuYW1lcyBUaGUgdXNlcm5hbWVzIHRvIGdldCB0aGVpciBjb3JyZXNwb25kaW5nIFVVSURzIGZvci5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxNYXA8c3RyaW5nLCBQbGF5ZXJOYW1lRGF0YT4+fSBBIG1hcCBvZiB0aGUgcGxheWVycycgdXNlcm5hbWVzIHRvIHRoZWlyIGRhdGEgb2JqZWN0LlxuICAgICAqL1xuICAgIGdldFV1aWRzKHVzZXJuYW1lczogc3RyaW5nW10pOiBQcm9taXNlPE1hcDxzdHJpbmcsIFBsYXllck5hbWVEYXRhPj4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8TWFwPHN0cmluZywgUGxheWVyTmFtZURhdGE+PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAodXNlcm5hbWVzLmxlbmd0aCA+IDEwKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCdBIG1heGltdW0gb2YgMTAgdXNlcm5hbWVzIHBlciByZXF1ZXN0IGlzIGVuZm9yY2VkIGJ5IE1vamFuZy4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VuZCBhIHJlcXVlc3RcbiAgICAgICAgICAgIHRoaXMucG9zdCgnL3Byb2ZpbGVzL21pbmVjcmFmdCcpXG4gICAgICAgICAgICAgICAgLnNlbmQodXNlcm5hbWVzKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbnRyaWVzID0gcmVzcG9uc2UuYm9keSBhcyBQbGF5ZXJOYW1lRGF0YVtdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwPHN0cmluZywgUGxheWVyTmFtZURhdGE+KCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXNlcm5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gZW50cmllc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuaWQgPSBVdGlsLmV4cGFuZFV1aWQoZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXAuc2V0KHVzZXJuYW1lc1tpXSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShtYXApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBwbGF5ZXJzIG5hbWUgaGlzdG9yeSBieSB0aGVpciBVVUlELlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1dWlkIFRoZSBVVUlEIG9mIHRoZSBwbGF5ZXIgdG8gZ2V0IHRoZSBuYW1lIGhpc3RvcnkgZm9yLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFBsYXllck5hbWVIaXN0b3J5Pn0gVGhlIHBsYXllcnMgbmFtZSBoaXN0b3J5XG4gICAgICovXG4gICAgZ2V0TmFtZUhpc3RvcnkodXVpZDogc3RyaW5nKTogUHJvbWlzZTxQbGF5ZXJOYW1lSGlzdG9yeT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8UGxheWVyTmFtZUhpc3Rvcnk+KCgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoIVV0aWwuaXNVdWlkKHV1aWQpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAndXVpZCcgcGFyYW1ldGVyIG11c3QgYmUgYSB2YWxpZCBVVUlELCBnb3QgJHt1dWlkfWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdldChgL3VzZXIvcHJvZmlsZXMvJHt1dWlkfS9uYW1lc2ApXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhpc3Rvcnk6IFBsYXllck5hbWVIaXN0b3J5RW50cnlbXSA9IHJlc3BvbnNlLmJvZHkubWFwKChpbXByb3BlcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbnRyeTogUGxheWVyTmFtZUhpc3RvcnlFbnRyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBpbXByb3Blci5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRUb0F0OiBpbXByb3Blci5jaGFuZ2VkVG9BdCAhPSB1bmRlZmluZWQgPyBuZXcgRGF0ZShpbXByb3Blci5jaGFuZ2VkVG9BdCkgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW50cnk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBVdGlsLmV4cGFuZFV1aWQodXVpZCksXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXN0b3J5OiBoaXN0b3J5XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgcGxheWVycycgcHJvZmlsZS5cbiAgICAgKiBAcGFyYW0gdXVpZCBUaGUgVVVJRCBvZiB0aGUgcGxheWVyIHRvIGdldCB0aGUgcHJvZmlsZSBvZi5cbiAgICAgKi9cbiAgICBnZXRQcm9maWxlKHV1aWQ6IHN0cmluZyk6IFByb21pc2U8UGxheWVyUHJvZmlsZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8UGxheWVyUHJvZmlsZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZ2VudC5nZXQoYGh0dHBzOi8vc2Vzc2lvbnNlcnZlci5tb2phbmcuY29tL3Nlc3Npb24vbWluZWNyYWZ0L3Byb2ZpbGUvJHt1dWlkfWApXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2ZpbGU6IFBsYXllclByb2ZpbGUgPSBuZXcgUGxheWVyUHJvZmlsZShyZXNwb25zZS5ib2R5KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShwcm9maWxlKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzZXJ2ZXJzIHRoYXQgTW9qYW5nIGhhcyBibG9ja2VkLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHN0cmluZ1tdPn0gQSBsaXN0IG9mIFNIQTEgaGFzaGVzIGZvciB0aGUgaG9zdG5hbWVzIHRoYXQgTW9qYW5nIGhhdmUgYmxvY2tlZC5cbiAgICAgKi9cbiAgICBnZXRCbG9ja2VkU2VydmVycygpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmdbXT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nZXQoJ2h0dHBzOi8vc2Vzc2lvbnNlcnZlci5tb2phbmcuY29tL2Jsb2NrZWRzZXJ2ZXJzJylcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZS50ZXh0LnNwbGl0KC9cXHMvZykpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEJFWU9ORCBUSElTIFBPSU5UIExJRVMgRU5EUE9JTlRTIFRIQVQgUkVRVUlSRSBBVVRIRU5USUNBVElPTlxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgbmFtZSBpcyBhdmFpbGFibGUuXG4gICAgICpcbiAgICAgKiA+ICoqTk9URSoqPGJyPlxuICAgICAqID4gVGhpcyBtZXRob2QgcmVxdWlyZXMgdGhlIGFjY2VzcyB0b2tlbiB0byBiZSBzZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0gYWNjZXNzVG9rZW4gVGhlIGFjY2VzcyB0b2tlbiB0byB1c2UuIElmIHVuc3BlY2lmaWVkLCBkZWZhdWx0cyB0byB0aGUgY2xpZW50cyBhY2Nlc3MgdG9rZW4uXG4gICAgICovXG4gICAgaXNOYW1lQXZhaWxhYmxlKG5hbWU6IHN0cmluZywgYWNjZXNzVG9rZW46IHN0cmluZyB8IE51bGxWYWx1ZSA9IHRoaXMuYWNjZXNzVG9rZW4pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmICghYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgICAgICByZWplY3QoJ2lzTmFtZUF2YWlsYWJsZSByZXF1aXJlcyBhbiBhY2Nlc3MgdG9rZW4hJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdldChgaHR0cHM6Ly9hcGkubWluZWNyYWZ0c2VydmljZXMuY29tL21pbmVjcmFmdC9wcm9maWxlL25hbWUvJHtuYW1lfS9hdmFpbGFibGVgKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlLmJvZHkuc3RhdHVzID09ICdBVkFJTEFCTEUnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2VzIHRoZSBuYW1lIG9mIHRoZSBhY2Nlc3MgdG9rZW5zIGNvcnJlc3BvbmRpbmcgdXNlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIHRvIGNoYW5nZSB0by5cbiAgICAgKiBAcGFyYW0gYWNjZXNzVG9rZW4gVGhlIGFjY2VzcyB0b2tlbiBvZiB0aGUgcGxheWVyIHRvIGNoYW5nZSB0aGUgbmFtZSBvZi4gSWYgdW5zcGVjaWZpZWQsIGRlZmF1bHRzIHRvIHRoZSBjbGllbnRzIGFjY2VzcyB0b2tlbi5cbiAgICAgKi9cbiAgICBjaGFuZ2VOYW1lKG5hbWU6IHN0cmluZywgYWNjZXNzVG9rZW46IHN0cmluZyB8IE51bGxWYWx1ZSA9IHRoaXMuYWNjZXNzVG9rZW4pOiBQcm9taXNlPE5hbWVDaGFuZ2VSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8TmFtZUNoYW5nZVJlc3BvbnNlPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCdjaGFuZ2VOYW1lIHJlcXVpcmVzIGFuIGFjY2VzcyB0b2tlbiEnKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucHV0KGBodHRwczovL2FwaS5taW5lY3JhZnRzZXJ2aWNlcy5jb20vbWluZWNyYWZ0L3Byb2ZpbGUvbmFtZS8ke25hbWV9YClcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYm9keSA9IHJlc3BvbnNlLmJvZHk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3TmFtZTogYm9keS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGJvZHkuc2tpbnNbMF0uaWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==