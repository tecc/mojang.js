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
 */
class Client extends BaseClient_1.BaseClient {
    /**
     * Constructs a new {@link Client Mojang API} client.
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
    getUuid(username, at) {
        return new Promise((resolve, reject) => {
            let timestamp = null;
            if (at) {
                timestamp = at.getTime() / 1000; // get rid of milliseconds
            }
            this.get('/users/profiles/minecraft/' + username, { at: timestamp })
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
}
exports.Client = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9qYW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vamFuZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQTBDO0FBRTFDLDZDQUErQjtBQThEL0IsTUFBYSxhQUFhO0lBTXRCLFlBQVksSUFBNEI7UUFDcEMsSUFBSSxDQUFDLElBQUk7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFXLENBQUM7UUFFbkMsV0FBVztRQUNYLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUMsSUFBSSxJQUFJLElBQUksU0FBUztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsV0FBVyxDQUFDLElBQVk7UUFDcEIsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BDLElBQUksUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7Z0JBQ3ZCLE9BQU8sUUFBUSxDQUFDO2FBQ25CO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsT0FBTztRQUNILE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUMzQyxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWixJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLO1lBQy9ELEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRztTQUNsQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDYixDQUFDO0lBQ0QsT0FBTztRQUNILE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUMzQyxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3RDLENBQUM7Q0FDSjtBQXRDRCxzQ0FzQ0M7QUFFRDs7O0dBR0c7QUFDSCxNQUFhLE1BQU8sU0FBUSx1QkFBVTtJQUNsQzs7T0FFRztJQUNIO1FBQ0ksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLGtCQUFrQixDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxPQUFPLENBQUMsUUFBZ0IsRUFBRSxFQUFTO1FBQy9CLE9BQU8sSUFBSSxPQUFPLENBQWlCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ25ELElBQUksU0FBUyxHQUF1QixJQUFJLENBQUM7WUFDekMsSUFBSSxFQUFFLEVBQUU7Z0JBQ0osU0FBUyxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQywwQkFBMEI7YUFDOUQ7WUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLDRCQUE0QixHQUFHLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQztpQkFDL0QsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ2YsTUFBTSxJQUFJLEdBQW1CLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxRQUFRLENBQUMsU0FBbUI7UUFDeEIsT0FBTyxJQUFJLE9BQU8sQ0FBOEIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDaEUsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtnQkFDdkIsTUFBTSxDQUFDLDhEQUE4RCxDQUFDLENBQUM7YUFDMUU7WUFFRCxpQkFBaUI7WUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztpQkFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDZixJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDZixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBd0IsQ0FBQztnQkFDbEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7Z0JBQzlDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN2QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ25DLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUMvQjtnQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsY0FBYyxDQUFDLElBQVk7UUFDdkIsT0FBTyxJQUFJLE9BQU8sQ0FBb0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUN6RTtZQUVELElBQUksQ0FBQyxHQUFHLENBQUMsa0JBQWtCLElBQUksUUFBUSxDQUFDO2lCQUNuQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDZixNQUFNLE9BQU8sR0FBNkIsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFhLEVBQUUsRUFBRTtvQkFDMUUsTUFBTSxLQUFLLEdBQTJCO3dCQUNsQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7d0JBQ25CLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO3FCQUM5RixDQUFDO29CQUNGLE9BQU8sS0FBSyxDQUFDO2dCQUNqQixDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPLENBQUM7b0JBQ0osRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO29CQUN6QixPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUNwQyxPQUFPLEVBQUUsT0FBTztpQkFDbkIsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFZO1FBQ25CLE9BQU8sSUFBSSxPQUFPLENBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLDhEQUE4RCxJQUFJLEVBQUUsQ0FBQztpQkFDL0UsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ2YsTUFBTSxPQUFPLEdBQWtCLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUF0R0Qsd0JBc0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUNsaWVudCB9IGZyb20gJy4vQmFzZUNsaWVudCc7XG5pbXBvcnQgdHlwZSB7IE51bGxWYWx1ZSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgKiBhcyBVdGlsIGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogUGxheWVyIG5hbWUgZGF0YS5cbiAqXG4gKiBQcm92aWRlZCBieSB7QGxpbmsgQ2xpZW50LmdldFV1aWR9IGFuZCB7QGxpbmsgQ2xpZW50LmdldFV1aWRzfS5cbiAqL1xuZXhwb3J0IHR5cGUgUGxheWVyTmFtZURhdGEgPSB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRW50cnkgdG8ge0BsaW5rIFBsYXllck5hbWVIaXN0b3J5fS5cbiAqL1xuZXhwb3J0IHR5cGUgUGxheWVyTmFtZUhpc3RvcnlFbnRyeSA9IHtcbiAgICAvKipcbiAgICAgKiBUaGVpciBuYW1lIGluIHRoaXMgZW50cnkuXG4gICAgICovXG4gICAgbmFtZTogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIFdoZW4gdGhlIHBsYXllciBjaGFuZ2VkIHRoZWlyIHVzZXJuYW1lIHRvIHtAbGluayBuYW1lfVxuICAgICAqL1xuICAgIGNoYW5nZWRUb0F0PzogRGF0ZTtcbn1cbi8qKlxuICogUGxheWVyIG5hbWUgaGlzdG9yeS5cbiAqXG4gKiBQcm92aWRlZCBieSB7QGxpbmsgQ2xpZW50LmdldE5hbWVIaXN0b3J5fS5cbiAqL1xuZXhwb3J0IHR5cGUgUGxheWVyTmFtZUhpc3RvcnkgPSB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBoaXN0b3J5OiBQbGF5ZXJOYW1lSGlzdG9yeUVudHJ5W107XG4gICAgY3VycmVudDogUGxheWVyTmFtZUhpc3RvcnlFbnRyeTtcbn1cblxuZXhwb3J0IHR5cGUgUGxheWVyUHJvZmlsZVByb3BlcnR5ID0ge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICB2YWx1ZTogYW55O1xuICAgIHNpZ25hdHVyZT86IHN0cmluZztcbn1cbnR5cGUgX1BsYXllclRleHR1cmVzT2JqID0ge1xuICAgIHRpbWVzdGFtcDogbnVtYmVyO1xuICAgIHByb2ZpbGVJZDogc3RyaW5nO1xuICAgIHByb2ZpbGVOYW1lOiBzdHJpbmc7XG4gICAgc2lnbmF0dXJlUmVxdWlyZWQ/OiBib29sZWFuO1xuICAgIHRleHR1cmVzOiB7XG4gICAgICAgIFNLSU4/OiB7XG4gICAgICAgICAgICB1cmw6IHN0cmluZ1xuICAgICAgICAgICAgbWV0YWRhdGE/OiB7XG4gICAgICAgICAgICAgICAgbW9kZWw6ICdzbGltJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBDQVBFPzoge1xuICAgICAgICAgICAgdXJsOiBzdHJpbmdcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCB0eXBlIFBsYXllclNraW4gPSB7XG4gICAgc2xpbTogYm9vbGVhbjtcbiAgICB1cmw6IHN0cmluZztcbn1cbmV4cG9ydCBjbGFzcyBQbGF5ZXJQcm9maWxlIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBwcm9wZXJ0aWVzOiBQbGF5ZXJQcm9maWxlUHJvcGVydHlbXTtcbiAgICBwcml2YXRlIHRleHR1cmVzOiBfUGxheWVyVGV4dHVyZXNPYmo7XG5cbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBQYXJ0aWFsPFBsYXllclByb2ZpbGU+KSB7XG4gICAgICAgIGlmICghZGF0YSkgdGhyb3cgbmV3IEVycm9yKCdQbGF5ZXIgcHJvZmlsZSBkYXRhIGNhbm5vdCBiZSBudWxsIScpO1xuICAgICAgICB0aGlzLmlkID0gZGF0YS5pZCE7XG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEubmFtZSE7XG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IGRhdGEucHJvcGVydGllcyE7XG5cbiAgICAgICAgLy8gdGV4dHVyZXNcbiAgICAgICAgY29uc3QgcHJvcCA9IHRoaXMuZ2V0UHJvcGVydHkoJ3RleHR1cmVzJyk7XG4gICAgICAgIGlmIChwcm9wID09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IEVycm9yKCdQcm9maWxlIHByb3BlcnR5IHRleHR1cmVzIGlzIG51bGwnKTtcbiAgICAgICAgdGhpcy50ZXh0dXJlcyA9IEpTT04ucGFyc2UoVXRpbC5iYXNlNjREZWNvZGUocHJvcC52YWx1ZSkpO1xuICAgIH1cblxuICAgIGdldFByb3BlcnR5KG5hbWU6IHN0cmluZyk6IFBsYXllclByb2ZpbGVQcm9wZXJ0eSB8IE51bGxWYWx1ZSB7XG4gICAgICAgIGZvciAoY29uc3QgcHJvcGVydHkgb2YgdGhpcy5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydHkubmFtZSA9PSBuYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldFNraW4oKTogUGxheWVyU2tpbiB8IE51bGxWYWx1ZSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMudGV4dHVyZXMudGV4dHVyZXMuU0tJTjtcbiAgICAgICAgcmV0dXJuIHNvdXJjZSA/IHtcbiAgICAgICAgICAgIHNsaW06IHNvdXJjZS5tZXRhZGF0YSA/IHNvdXJjZS5tZXRhZGF0YS5tb2RlbCA9PSAnc2xpbScgOiBmYWxzZSxcbiAgICAgICAgICAgIHVybDogc291cmNlLnVybFxuICAgICAgICB9IDogbnVsbDtcbiAgICB9XG4gICAgZ2V0Q2FwZSgpOiBzdHJpbmcgfCBOdWxsVmFsdWUge1xuICAgICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLnRleHR1cmVzLnRleHR1cmVzLkNBUEU7XG4gICAgICAgIHJldHVybiBzb3VyY2UgPyBzb3VyY2UudXJsIDogbnVsbDtcbiAgICB9XG59XG5cbi8qKlxuICogTW9qYW5nIEFQSSBjbGllbnQgd3JhcHBlci5cbiAqIFRoZSBzcGVjaWZpY2F0aW9ucyBmb3IgdGhlIEFQSSB0aGlzIGNsYXNzIHdyYXBzIGFyb3VuZCBpcyBhdmFpbGFibGUgYXQge0BsaW5rIGh0dHBzOi8vd2lraS52Zy9Nb2phbmdfQVBJfS5cbiAqL1xuZXhwb3J0IGNsYXNzIENsaWVudCBleHRlbmRzIEJhc2VDbGllbnQge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYSBuZXcge0BsaW5rIENsaWVudCBNb2phbmcgQVBJfSBjbGllbnQuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCdodHRwczovL2FwaS5tb2phbmcuY29tJyk7XG4gICAgICAgIHRoaXMuYWdlbnQuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBwbGF5ZXJzIFVVSUQgYnkgdGhlaXIgdXNlcm5hbWUuXG4gICAgICogWW91IGNhbiBjaG9vc2Ugd2hlbiB0aGUgdXNlcm5hbWUgc2hvdWxkJ3ZlIGJlZW4gdXNlZCwgaW5zdGVhZCBvZiB3aG9ldmVyIGFzIGl0IG5vdyB3aXRoIHRoaXMuXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIFRoZSB1c2VybmFtZSBvZiB0aGUgcGxheWVyIHRvIGdldCB0aGUgVVVJRCBmb3JcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGF0IFdoZW4gdGhpcyB1c2VybmFtZSBzaG91bGQndmUgYmVlbiB1c2VkIGZvciB0aGUgVVVJRCAocGxlYXNlIGNsYXJpZnkpXG4gICAgICogQHJldHVybnMge1Byb21pc2U8UGxheWVyTmFtZURhdGE+fSBUaGUgcGxheWVyIG5hbWUgZGF0YVxuICAgICAqL1xuICAgIGdldFV1aWQodXNlcm5hbWU6IHN0cmluZywgYXQ/OiBEYXRlKTogUHJvbWlzZTxQbGF5ZXJOYW1lRGF0YT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8UGxheWVyTmFtZURhdGE+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCB0aW1lc3RhbXA6IG51bWJlciB8IE51bGxWYWx1ZSA9IG51bGw7XG4gICAgICAgICAgICBpZiAoYXQpIHtcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXAgPSBhdC5nZXRUaW1lKCkgLyAxMDAwOyAvLyBnZXQgcmlkIG9mIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdldCgnL3VzZXJzL3Byb2ZpbGVzL21pbmVjcmFmdC8nICsgdXNlcm5hbWUsIHsgYXQ6IHRpbWVzdGFtcCB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhOiBQbGF5ZXJOYW1lRGF0YSA9IHJlc3BvbnNlLmJvZHk7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaWQgPSBVdGlsLmV4cGFuZFV1aWQoZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGxpc3Qgb2YgVVVJRHMgZm9yIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IHVzZXJuYW1lcyBUaGUgdXNlcm5hbWVzIHRvIGdldCB0aGVpciBjb3JyZXNwb25kaW5nIFVVSURzIGZvci5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxNYXA8c3RyaW5nLCBQbGF5ZXJOYW1lRGF0YT4+fSBBIG1hcCBvZiB0aGUgcGxheWVycycgdXNlcm5hbWVzIHRvIHRoZWlyIGRhdGEgb2JqZWN0LlxuICAgICAqL1xuICAgIGdldFV1aWRzKHVzZXJuYW1lczogc3RyaW5nW10pOiBQcm9taXNlPE1hcDxzdHJpbmcsIFBsYXllck5hbWVEYXRhPj4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8TWFwPHN0cmluZywgUGxheWVyTmFtZURhdGE+PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAodXNlcm5hbWVzLmxlbmd0aCA+IDEwKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCdBIG1heGltdW0gb2YgMTAgdXNlcm5hbWVzIHBlciByZXF1ZXN0IGlzIGVuZm9yY2VkIGJ5IE1vamFuZy4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VuZCBhIHJlcXVlc3RcbiAgICAgICAgICAgIHRoaXMucG9zdCgnL3Byb2ZpbGVzL21pbmVjcmFmdCcpXG4gICAgICAgICAgICAgICAgLnNlbmQodXNlcm5hbWVzKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbnRyaWVzID0gcmVzcG9uc2UuYm9keSBhcyBQbGF5ZXJOYW1lRGF0YVtdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwPHN0cmluZywgUGxheWVyTmFtZURhdGE+KCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXNlcm5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gZW50cmllc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuaWQgPSBVdGlsLmV4cGFuZFV1aWQoZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXAuc2V0KHVzZXJuYW1lc1tpXSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShtYXApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBwbGF5ZXJzIG5hbWUgaGlzdG9yeSBieSB0aGVpciBVVUlELlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1dWlkIFRoZSBVVUlEIG9mIHRoZSBwbGF5ZXIgdG8gZ2V0IHRoZSBuYW1lIGhpc3RvcnkgZm9yLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFBsYXllck5hbWVIaXN0b3J5Pn0gVGhlIHBsYXllcnMgbmFtZSBoaXN0b3J5XG4gICAgICovXG4gICAgZ2V0TmFtZUhpc3RvcnkodXVpZDogc3RyaW5nKTogUHJvbWlzZTxQbGF5ZXJOYW1lSGlzdG9yeT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8UGxheWVyTmFtZUhpc3Rvcnk+KCgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoIVV0aWwuaXNVdWlkKHV1aWQpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAndXVpZCcgcGFyYW1ldGVyIG11c3QgYmUgYSB2YWxpZCBVVUlELCBnb3QgJHt1dWlkfWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdldChgL3VzZXIvcHJvZmlsZXMvJHt1dWlkfS9uYW1lc2ApXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhpc3Rvcnk6IFBsYXllck5hbWVIaXN0b3J5RW50cnlbXSA9IHJlc3BvbnNlLmJvZHkubWFwKChpbXByb3BlcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbnRyeTogUGxheWVyTmFtZUhpc3RvcnlFbnRyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBpbXByb3Blci5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRUb0F0OiBpbXByb3Blci5jaGFuZ2VkVG9BdCAhPSB1bmRlZmluZWQgPyBuZXcgRGF0ZShpbXByb3Blci5jaGFuZ2VkVG9BdCkgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW50cnk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBVdGlsLmV4cGFuZFV1aWQodXVpZCksXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiBoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXN0b3J5OiBoaXN0b3J5XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBnZXRQcm9maWxlKHV1aWQ6IHN0cmluZyk6IFByb21pc2U8UGxheWVyUHJvZmlsZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8UGxheWVyUHJvZmlsZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZ2VudC5nZXQoYGh0dHBzOi8vc2Vzc2lvbnNlcnZlci5tb2phbmcuY29tL3Nlc3Npb24vbWluZWNyYWZ0L3Byb2ZpbGUvJHt1dWlkfWApXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2ZpbGU6IFBsYXllclByb2ZpbGUgPSBuZXcgUGxheWVyUHJvZmlsZShyZXNwb25zZS5ib2R5KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShwcm9maWxlKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG59Il19