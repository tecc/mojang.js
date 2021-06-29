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
exports.Client = void 0;
const BaseClient_1 = require("./BaseClient");
const Util = __importStar(require("./util"));
/**
 * Mojang API client wrapper.
 * The specifications for the API this class wraps around is available at {@link https://wiki.vg/Mojang_API}
 */
class Client extends BaseClient_1.BaseClient {
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
                    uuid: Util.expandUuid(uuid),
                    current: history[history.length - 1],
                    history: history
                });
            })
                .catch(reject);
        }));
    }
}
exports.Client = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9qYW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vamFuZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQTBDO0FBRTFDLDZDQUErQjtBQXVCL0I7OztHQUdHO0FBQ0gsTUFBYSxNQUFPLFNBQVEsdUJBQVU7SUFDbEM7O09BRUc7SUFDSDtRQUNJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsT0FBTyxDQUFDLFFBQWdCLEVBQUUsRUFBUztRQUMvQixPQUFPLElBQUksT0FBTyxDQUFpQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNuRCxJQUFJLFNBQVMsR0FBdUIsSUFBSSxDQUFDO1lBQ3pDLElBQUksRUFBRSxFQUFFO2dCQUNKLFNBQVMsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsMEJBQTBCO2FBQzlEO1lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUM7aUJBQy9ELElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUNmLE1BQU0sSUFBSSxHQUFtQixRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUMzQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsUUFBUSxDQUFDLFNBQW1CO1FBQ3hCLE9BQU8sSUFBSSxPQUFPLENBQThCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ2hFLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7Z0JBQ3ZCLE1BQU0sQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO2FBQzFFO1lBRUQsaUJBQWlCO1lBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUM7aUJBQzNCLElBQUksQ0FBQyxTQUFTLENBQUM7aUJBQ2YsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ2YsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQXdCLENBQUM7Z0JBQ2xELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO2dCQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDdkMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNuQyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDL0I7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGNBQWMsQ0FBQyxJQUFZO1FBQ3ZCLE9BQU8sSUFBSSxPQUFPLENBQW9CLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDekU7WUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLGtCQUFrQixJQUFJLFFBQVEsQ0FBQztpQkFDbkMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ2YsTUFBTSxPQUFPLEdBQTZCLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBYSxFQUFFLEVBQUU7b0JBQzFFLE1BQU0sS0FBSyxHQUEyQjt3QkFDbEMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO3dCQUNuQixXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztxQkFDOUYsQ0FBQztvQkFDRixPQUFPLEtBQUssQ0FBQztnQkFDakIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTyxDQUFDO29CQUNKLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztvQkFDM0IsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDcEMsT0FBTyxFQUFFLE9BQU87aUJBQ25CLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7Q0FDSjtBQTNGRCx3QkEyRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlQ2xpZW50IH0gZnJvbSAnLi9CYXNlQ2xpZW50JztcbmltcG9ydCB0eXBlIHsgTnVsbFZhbHVlIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IHR5cGUgUGxheWVyTmFtZURhdGEgPSB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIFBsYXllck5hbWVIaXN0b3J5RW50cnkgPSB7XG4gICAgLyoqXG4gICAgICogVGhlaXIgbmFtZSBpbiB0aGlzIGVudHJ5LlxuICAgICAqL1xuICAgIG5hbWU6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBXaGVuIHRoZSBwbGF5ZXIgY2hhbmdlZCB0aGVpciB1c2VybmFtZSB0byB7QGxpbmsgbmFtZX1cbiAgICAgKi9cbiAgICBjaGFuZ2VkVG9BdD86IERhdGU7XG59XG5leHBvcnQgdHlwZSBQbGF5ZXJOYW1lSGlzdG9yeSA9IHtcbiAgICB1dWlkOiBzdHJpbmc7XG4gICAgaGlzdG9yeTogUGxheWVyTmFtZUhpc3RvcnlFbnRyeVtdO1xuICAgIGN1cnJlbnQ6IFBsYXllck5hbWVIaXN0b3J5RW50cnk7XG59XG5cbi8qKlxuICogTW9qYW5nIEFQSSBjbGllbnQgd3JhcHBlci5cbiAqIFRoZSBzcGVjaWZpY2F0aW9ucyBmb3IgdGhlIEFQSSB0aGlzIGNsYXNzIHdyYXBzIGFyb3VuZCBpcyBhdmFpbGFibGUgYXQge0BsaW5rIGh0dHBzOi8vd2lraS52Zy9Nb2phbmdfQVBJfVxuICovXG5leHBvcnQgY2xhc3MgQ2xpZW50IGV4dGVuZHMgQmFzZUNsaWVudCB7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0cyBhIG5ldyBNb2phbmcgQVBJIGNsaWVudC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoJ2h0dHBzOi8vYXBpLm1vamFuZy5jb20nKTtcbiAgICAgICAgdGhpcy5hZ2VudC5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIHBsYXllcnMgVVVJRCBieSB0aGVpciB1c2VybmFtZS5cbiAgICAgKiBZb3UgY2FuIGNob29zZSB3aGVuIHRoZSB1c2VybmFtZSBzaG91bGQndmUgYmVlbiB1c2VkLCBpbnN0ZWFkIG9mIHdob2V2ZXIgYXMgaXQgbm93IHdpdGggdGhpcy5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlcm5hbWUgVGhlIHVzZXJuYW1lIG9mIHRoZSBwbGF5ZXIgdG8gZ2V0IHRoZSBVVUlEIGZvclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gYXQgV2hlbiB0aGlzIHVzZXJuYW1lIHNob3VsZCd2ZSBiZWVuIHVzZWQgZm9yIHRoZSBVVUlEIChwbGVhc2UgY2xhcmlmeSlcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQbGF5ZXJOYW1lRGF0YT59IFRoZSBwbGF5ZXIgbmFtZSBkYXRhXG4gICAgICovXG4gICAgZ2V0VXVpZCh1c2VybmFtZTogc3RyaW5nLCBhdD86IERhdGUpOiBQcm9taXNlPFBsYXllck5hbWVEYXRhPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxQbGF5ZXJOYW1lRGF0YT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRpbWVzdGFtcDogbnVtYmVyIHwgTnVsbFZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChhdCkge1xuICAgICAgICAgICAgICAgIHRpbWVzdGFtcCA9IGF0LmdldFRpbWUoKSAvIDEwMDA7IC8vIGdldCByaWQgb2YgbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0KCcvdXNlcnMvcHJvZmlsZXMvbWluZWNyYWZ0LycgKyB1c2VybmFtZSwgeyBhdDogdGltZXN0YW1wIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGE6IFBsYXllck5hbWVEYXRhID0gcmVzcG9uc2UuYm9keTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5pZCA9IFV0aWwuZXhwYW5kVXVpZChkYXRhLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbGlzdCBvZiBVVUlEcyBmb3IgXG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0gdXNlcm5hbWVzIFRoZSB1c2VybmFtZXMgdG8gZ2V0IHRoZWlyIGNvcnJlc3BvbmRpbmcgVVVJRHMgZm9yLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPE1hcDxzdHJpbmcsIFBsYXllck5hbWVEYXRhPj59IEEgbWFwIG9mIHRoZSBwbGF5ZXJzJyB1c2VybmFtZXMgdG8gdGhlaXIgZGF0YSBvYmplY3QuXG4gICAgICovXG4gICAgZ2V0VXVpZHModXNlcm5hbWVzOiBzdHJpbmdbXSk6IFByb21pc2U8TWFwPHN0cmluZywgUGxheWVyTmFtZURhdGE+PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxNYXA8c3RyaW5nLCBQbGF5ZXJOYW1lRGF0YT4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmICh1c2VybmFtZXMubGVuZ3RoID4gMTApIHtcbiAgICAgICAgICAgICAgICByZWplY3QoJ0EgbWF4aW11bSBvZiAxMCB1c2VybmFtZXMgcGVyIHJlcXVlc3QgaXMgZW5mb3JjZWQgYnkgTW9qYW5nLicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZW5kIGEgcmVxdWVzdFxuICAgICAgICAgICAgdGhpcy5wb3N0KCcvcHJvZmlsZXMvbWluZWNyYWZ0JylcbiAgICAgICAgICAgICAgICAuc2VuZCh1c2VybmFtZXMpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVudHJpZXMgPSByZXNwb25zZS5ib2R5IGFzIFBsYXllck5hbWVEYXRhW107XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXA8c3RyaW5nLCBQbGF5ZXJOYW1lRGF0YT4oKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1c2VybmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBlbnRyaWVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5pZCA9IFV0aWwuZXhwYW5kVXVpZChkYXRhLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5zZXQodXNlcm5hbWVzW2ldLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG1hcCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIHBsYXllcnMgbmFtZSBoaXN0b3J5IGJ5IHRoZWlyIFVVSUQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHV1aWQgVGhlIFVVSUQgb2YgdGhlIHBsYXllciB0byBnZXQgdGhlIG5hbWUgaGlzdG9yeSBmb3IuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8UGxheWVyTmFtZUhpc3Rvcnk+fSBUaGUgcGxheWVycyBuYW1lIGhpc3RvcnlcbiAgICAgKi9cbiAgICBnZXROYW1lSGlzdG9yeSh1dWlkOiBzdHJpbmcpOiBQcm9taXNlPFBsYXllck5hbWVIaXN0b3J5PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxQbGF5ZXJOYW1lSGlzdG9yeT4oKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmICghVXRpbC5pc1V1aWQodXVpZCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCd1dWlkJyBwYXJhbWV0ZXIgbXVzdCBiZSBhIHZhbGlkIFVVSUQsIGdvdCAke3V1aWR9YCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0KGAvdXNlci9wcm9maWxlcy8ke3V1aWR9L25hbWVzYClcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGlzdG9yeTogUGxheWVyTmFtZUhpc3RvcnlFbnRyeVtdID0gcmVzcG9uc2UuYm9keS5tYXAoKGltcHJvcGVyOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVudHJ5OiBQbGF5ZXJOYW1lSGlzdG9yeUVudHJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGltcHJvcGVyLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFRvQXQ6IGltcHJvcGVyLmNoYW5nZWRUb0F0ICE9IHVuZGVmaW5lZCA/IG5ldyBEYXRlKGltcHJvcGVyLmNoYW5nZWRUb0F0KSA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDogVXRpbC5leHBhbmRVdWlkKHV1aWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDogaGlzdG9yeVtoaXN0b3J5Lmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGlzdG9yeTogaGlzdG9yeVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICB9KSk7XG4gICAgfVxufSJdfQ==