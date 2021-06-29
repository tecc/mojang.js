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
                const history = response.body;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9qYW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vamFuZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQTBDO0FBRTFDLDZDQUErQjtBQXVCL0I7OztHQUdHO0FBQ0gsTUFBYSxNQUFPLFNBQVEsdUJBQVU7SUFDbEM7O09BRUc7SUFDSDtRQUNJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsT0FBTyxDQUFDLFFBQWdCLEVBQUUsRUFBUztRQUMvQixPQUFPLElBQUksT0FBTyxDQUFpQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNuRCxJQUFJLFNBQVMsR0FBdUIsSUFBSSxDQUFDO1lBQ3pDLElBQUksRUFBRSxFQUFFO2dCQUNKLFNBQVMsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsMEJBQTBCO2FBQzlEO1lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsR0FBRyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUM7aUJBQy9ELElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUNmLE1BQU0sSUFBSSxHQUFtQixRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUMzQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsUUFBUSxDQUFDLFNBQW1CO1FBQ3hCLE9BQU8sSUFBSSxPQUFPLENBQThCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ2hFLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7Z0JBQ3ZCLE1BQU0sQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO2FBQzFFO1lBRUQsaUJBQWlCO1lBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUM7aUJBQzNCLElBQUksQ0FBQyxTQUFTLENBQUM7aUJBQ2YsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ2YsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQXdCLENBQUM7Z0JBQ2xELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO2dCQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDdkMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNuQyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDL0I7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGNBQWMsQ0FBQyxJQUFZO1FBQ3ZCLE9BQU8sSUFBSSxPQUFPLENBQW9CLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDekU7WUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLGtCQUFrQixJQUFJLFFBQVEsQ0FBQztpQkFDbkMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ2YsTUFBTSxPQUFPLEdBQTZCLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ3hELE9BQU8sQ0FBQztvQkFDSixJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7b0JBQzNCLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7b0JBQ3BDLE9BQU8sRUFBRSxPQUFPO2lCQUNuQixDQUFDLENBQUM7WUFDUCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO0NBQ0o7QUFyRkQsd0JBcUZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUNsaWVudCB9IGZyb20gJy4vQmFzZUNsaWVudCc7XG5pbXBvcnQgdHlwZSB7IE51bGxWYWx1ZSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgKiBhcyBVdGlsIGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCB0eXBlIFBsYXllck5hbWVEYXRhID0ge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBpZDogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBQbGF5ZXJOYW1lSGlzdG9yeUVudHJ5ID0ge1xuICAgIC8qKlxuICAgICAqIFRoZWlyIG5hbWUgaW4gdGhpcyBlbnRyeS5cbiAgICAgKi9cbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogV2hlbiB0aGUgcGxheWVyIGNoYW5nZWQgdGhlaXIgdXNlcm5hbWUgdG8ge0BsaW5rIG5hbWV9XG4gICAgICovXG4gICAgY2hhbmdlZFRvQXQ/OiBEYXRlO1xufVxuZXhwb3J0IHR5cGUgUGxheWVyTmFtZUhpc3RvcnkgPSB7XG4gICAgdXVpZDogc3RyaW5nO1xuICAgIGhpc3Rvcnk6IFBsYXllck5hbWVIaXN0b3J5RW50cnlbXTtcbiAgICBjdXJyZW50OiBQbGF5ZXJOYW1lSGlzdG9yeUVudHJ5O1xufVxuXG4vKipcbiAqIE1vamFuZyBBUEkgY2xpZW50IHdyYXBwZXIuXG4gKiBUaGUgc3BlY2lmaWNhdGlvbnMgZm9yIHRoZSBBUEkgdGhpcyBjbGFzcyB3cmFwcyBhcm91bmQgaXMgYXZhaWxhYmxlIGF0IHtAbGluayBodHRwczovL3dpa2kudmcvTW9qYW5nX0FQSX1cbiAqL1xuZXhwb3J0IGNsYXNzIENsaWVudCBleHRlbmRzIEJhc2VDbGllbnQge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYSBuZXcgTW9qYW5nIEFQSSBjbGllbnQuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCdodHRwczovL2FwaS5tb2phbmcuY29tJyk7XG4gICAgICAgIHRoaXMuYWdlbnQuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBwbGF5ZXJzIFVVSUQgYnkgdGhlaXIgdXNlcm5hbWUuXG4gICAgICogWW91IGNhbiBjaG9vc2Ugd2hlbiB0aGUgdXNlcm5hbWUgc2hvdWxkJ3ZlIGJlZW4gdXNlZCwgaW5zdGVhZCBvZiB3aG9ldmVyIGFzIGl0IG5vdyB3aXRoIHRoaXMuXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIFRoZSB1c2VybmFtZSBvZiB0aGUgcGxheWVyIHRvIGdldCB0aGUgVVVJRCBmb3JcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGF0IFdoZW4gdGhpcyB1c2VybmFtZSBzaG91bGQndmUgYmVlbiB1c2VkIGZvciB0aGUgVVVJRCAocGxlYXNlIGNsYXJpZnkpXG4gICAgICogQHJldHVybnMge1Byb21pc2U8UGxheWVyTmFtZURhdGE+fSBUaGUgcGxheWVyIG5hbWUgZGF0YVxuICAgICAqL1xuICAgIGdldFV1aWQodXNlcm5hbWU6IHN0cmluZywgYXQ/OiBEYXRlKTogUHJvbWlzZTxQbGF5ZXJOYW1lRGF0YT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8UGxheWVyTmFtZURhdGE+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCB0aW1lc3RhbXA6IG51bWJlciB8IE51bGxWYWx1ZSA9IG51bGw7XG4gICAgICAgICAgICBpZiAoYXQpIHtcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXAgPSBhdC5nZXRUaW1lKCkgLyAxMDAwOyAvLyBnZXQgcmlkIG9mIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdldCgnL3VzZXJzL3Byb2ZpbGVzL21pbmVjcmFmdC8nICsgdXNlcm5hbWUsIHsgYXQ6IHRpbWVzdGFtcCB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhOiBQbGF5ZXJOYW1lRGF0YSA9IHJlc3BvbnNlLmJvZHk7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaWQgPSBVdGlsLmV4cGFuZFV1aWQoZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGxpc3Qgb2YgVVVJRHMgZm9yIFxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IHVzZXJuYW1lcyBUaGUgdXNlcm5hbWVzIHRvIGdldCB0aGVpciBjb3JyZXNwb25kaW5nIFVVSURzIGZvci5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxNYXA8c3RyaW5nLCBQbGF5ZXJOYW1lRGF0YT4+fSBBIG1hcCBvZiB0aGUgcGxheWVycycgdXNlcm5hbWVzIHRvIHRoZWlyIGRhdGEgb2JqZWN0LlxuICAgICAqL1xuICAgIGdldFV1aWRzKHVzZXJuYW1lczogc3RyaW5nW10pOiBQcm9taXNlPE1hcDxzdHJpbmcsIFBsYXllck5hbWVEYXRhPj4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8TWFwPHN0cmluZywgUGxheWVyTmFtZURhdGE+PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAodXNlcm5hbWVzLmxlbmd0aCA+IDEwKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCdBIG1heGltdW0gb2YgMTAgdXNlcm5hbWVzIHBlciByZXF1ZXN0IGlzIGVuZm9yY2VkIGJ5IE1vamFuZy4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VuZCBhIHJlcXVlc3RcbiAgICAgICAgICAgIHRoaXMucG9zdCgnL3Byb2ZpbGVzL21pbmVjcmFmdCcpXG4gICAgICAgICAgICAgICAgLnNlbmQodXNlcm5hbWVzKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbnRyaWVzID0gcmVzcG9uc2UuYm9keSBhcyBQbGF5ZXJOYW1lRGF0YVtdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwPHN0cmluZywgUGxheWVyTmFtZURhdGE+KCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXNlcm5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gZW50cmllc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuaWQgPSBVdGlsLmV4cGFuZFV1aWQoZGF0YS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXAuc2V0KHVzZXJuYW1lc1tpXSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShtYXApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBwbGF5ZXJzIG5hbWUgaGlzdG9yeSBieSB0aGVpciBVVUlELlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1dWlkIFRoZSBVVUlEIG9mIHRoZSBwbGF5ZXIgdG8gZ2V0IHRoZSBuYW1lIGhpc3RvcnkgZm9yLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFBsYXllck5hbWVIaXN0b3J5Pn0gVGhlIHBsYXllcnMgbmFtZSBoaXN0b3J5XG4gICAgICovXG4gICAgZ2V0TmFtZUhpc3RvcnkodXVpZDogc3RyaW5nKTogUHJvbWlzZTxQbGF5ZXJOYW1lSGlzdG9yeT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8UGxheWVyTmFtZUhpc3Rvcnk+KCgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoIVV0aWwuaXNVdWlkKHV1aWQpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAndXVpZCcgcGFyYW1ldGVyIG11c3QgYmUgYSB2YWxpZCBVVUlELCBnb3QgJHt1dWlkfWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdldChgL3VzZXIvcHJvZmlsZXMvJHt1dWlkfS9uYW1lc2ApXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhpc3Rvcnk6IFBsYXllck5hbWVIaXN0b3J5RW50cnlbXSA9IHJlc3BvbnNlLmJvZHk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZDogVXRpbC5leHBhbmRVdWlkKHV1aWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDogaGlzdG9yeVtoaXN0b3J5Lmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGlzdG9yeTogaGlzdG9yeVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICB9KSk7XG4gICAgfVxufSJdfQ==