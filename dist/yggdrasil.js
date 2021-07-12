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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.generateClientToken = void 0;
const BaseClient_1 = require("./BaseClient");
const Util = __importStar(require("./util"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generates a client token. A client token has to be virtually impossible to be the same for any 2 clients.
 *
 * @param name The client name.
 * @param version The client version.
 * @param time The time.
 * @param number Random number.
 */
function generateClientToken(name = 'mojang.js', version = Util.packageDetails.version, time = Date.now(), number = crypto_1.default.randomInt(0, 4294967296)) {
    const hash = crypto_1.default.createHash('sha512');
    hash.write(name.toString());
    hash.write(version.toString());
    hash.write(time.toString());
    hash.write(number.toString());
    return hash.digest().toString('hex');
}
exports.generateClientToken = generateClientToken;
class Client extends BaseClient_1.BaseClient {
    /**
     * Constructs an instance of the Yggdrasil API wrapper.
     *
     * @param clientToken The client token to use. If not provided, it will be automatically generated.
     */
    constructor(clientToken = generateClientToken()) {
        super('https://authserver.mojang.com', false); // can't have caching for this
        this.agent.set('Content-Type', 'application/json');
        this.clientToken = clientToken;
    }
    /**
     * Gets the current access token that's used by default.
     */
    getAccessToken() {
        return this.accessToken;
    }
    getClientToken() {
        return this.clientToken;
    }
    /**
     * Authenticates this client.
     *
     * @param username The username for the
     * @param password The password
     * @param use Whether or not to set this clients tokens to the tokens from the response.
     * @param clientToken The client token to use. This is automatically set by mojang.js, and is not recommended to specify manually.
     *
     * @returns {Promise<AuthenticationResponse>} The raw response from the API.
     * @todo Make the raw response more fit for the end user.
     */
    authenticate(username, password, use = true, clientToken = this.clientToken) {
        return new Promise((resolve, reject) => {
            this.post('/authenticate')
                .send({
                agent: {
                    name: 'Minecraft',
                    version: 1
                },
                username: username,
                password: password,
                clientToken: clientToken,
                requestUser: true
            })
                .then((response) => {
                const res = response.body;
                if (use) {
                    this.accessToken = res.accessToken;
                }
                resolve(res);
            })
                .catch(reject);
        });
    }
    /**
     * Validates an access token.
     * @param accessToken The access token to validate.
     * @param clientToken The client token to check against. If specified, it must match the one used to authenticate the access token in the first place.
     * @returns {Promise<boolean>} True if the access token is valid, false otherwise.
     */
    validateAccessToken(accessToken = this.accessToken, clientToken = this.clientToken) {
        return new Promise((resolve, reject) => {
            if (!accessToken)
                reject('No access token specified!');
            else
                this.post('/validate')
                    .ok((res) => res.status < 400 || res.status == 403)
                    .send({
                    accessToken: accessToken,
                    clientToken: clientToken
                })
                    .then((res) => {
                    if (res.noContent)
                        resolve(true);
                    else if (res.forbidden)
                        resolve(false);
                    else {
                        Util.warn('Response has a none-204 or 403 status code, automatically detecting.');
                        if (res.status < 400)
                            resolve(true);
                        else
                            resolve(false);
                    }
                })
                    .catch(reject);
        });
    }
    /**
     * Refreshes an access token.
     * If the access token was authenticated with a different client token, it must be specified.
     *
     * @param accessToken The access token to refresh.
     * @param clientToken The client token used to authenticate the access token in the first place.
     *
     * @returns {Promise<RefreshResponse>} The refresh response.
     */
    refreshAccessToken(accessToken = this.accessToken, clientToken = this.clientToken) {
        return new Promise((resolve, reject) => {
            if (!accessToken)
                reject('No access token specified!');
            else
                this.post('/refresh')
                    .send({
                    accessToken: accessToken,
                    clientToken: clientToken,
                    requestUser: true
                })
                    .then((response) => {
                    resolve(response.body);
                })
                    .catch(reject);
        });
    }
    /**
     * Invalidates all access tokens for an account.
     *
     * > **NOTE**<br>
     * > This may cause an inconvenience to the user. Use with care.
     * > To invalidate a single access token, use {@link Client.invalidateAccessToken}
     *
     * @see Client.invalidateAccessToken
     *
     * @param username The username of the player to sign out.
     * @param password The password of the player to sign out.
     * @returns {Promise<void>} Nothing.
     */
    signout(username, password) {
        return new Promise((resolve, reject) => {
            this.post('/signout')
                .send({
                username: username,
                password: password
            })
                .then((response) => {
                if (!response.noContent)
                    Util.warn('Response is not noContent');
                resolve();
            })
                .catch(reject);
        });
    }
    /**
     * Invalidates an access token.
     *
     * @param accessToken The access token to invalidate.
     * @param clientToken The client token used to authenticate the access token in the first place.
     * @returns {Promise<void>} Nothing.
     */
    invalidateAccessToken(accessToken = this.accessToken, clientToken = this.clientToken) {
        return new Promise((resolve, reject) => {
            if (!accessToken)
                reject('No access token specified!');
            else
                this.post('/invalidate')
                    .send({
                    accessToken: accessToken,
                    clientToken: clientToken
                })
                    .then((response) => {
                    if (!response.noContent)
                        Util.warn('Response is not noContent');
                    resolve();
                })
                    .catch(reject);
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWdnZHJhc2lsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3lnZ2RyYXNpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQTBDO0FBRzFDLDZDQUErQjtBQUMvQixvREFBNEI7QUErQjVCOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQixtQkFBbUIsQ0FDL0IsSUFBSSxHQUFHLFdBQVcsRUFDbEIsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUNyQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUNqQixNQUFNLEdBQUcsZ0JBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQztJQUV4QyxNQUFNLElBQUksR0FBRyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBWkQsa0RBWUM7QUFFRCxNQUFhLE1BQU8sU0FBUSx1QkFBVTtJQUlsQzs7OztPQUlHO0lBQ0gsWUFBWSxjQUFzQixtQkFBbUIsRUFBRTtRQUNuRCxLQUFLLENBQUMsK0JBQStCLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyw4QkFBOEI7UUFDN0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLGtCQUFr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LENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztxQkFDeEIsSUFBSSxDQUFDO29CQUNGLFdBQVcsRUFBRSxXQUFXO29CQUN4QixXQUFXLEVBQUUsV0FBVztpQkFDM0IsQ0FBQztxQkFDRCxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFDZixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVM7d0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO29CQUNoRSxPQUFPLEVBQUUsQ0FBQztnQkFDZCxDQUFDLENBQUM7cUJBQ0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBcEtELHdCQW9LQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2VDbGllbnQgfSBmcm9tICcuL0Jhc2VDbGllbnQnO1xuaW1wb3J0IHsgcmVqZWN0cyB9IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQgeyBOdWxsVmFsdWUgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0ICogYXMgVXRpbCBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFlnZ2RyYXNpbEVycm9yIHtcbiAgICBlcnJvcjogc3RyaW5nXG4gICAgZXJyb3JNZXNzYWdlOiBzdHJpbmdcbiAgICBjYXVzZT86IHN0cmluZ1xufVxuXG50eXBlIFJlZnJlc2hSZXNwb25zZSA9IHtcbiAgICB1c2VyOiB7XG4gICAgICAgIGlkOiBzdHJpbmdcbiAgICAgICAgcHJvcGVydGllczoge25hbWU6ICdwcmVmZXJyZWRMYW5ndWFnZScgfCAndHdpdGNoX2FjY2Vzc190b2tlbicsIHZhbHVlOiBzdHJpbmd9W11cbiAgICB9XG4gICAgY2xpZW50VG9rZW46IHN0cmluZ1xuICAgIGFjY2Vzc1Rva2VuOiBzdHJpbmdcbiAgICBzZWxlY3RlZFByb2ZpbGU6IHtcbiAgICAgICAgbmFtZTogc3RyaW5nXG4gICAgICAgIGlkOiBzdHJpbmdcbiAgICB9XG59XG50eXBlIEF1dGhlbnRpY2F0aW9uUmVzcG9uc2UgPSBSZWZyZXNoUmVzcG9uc2UgJiB7XG4gICAgdXNlcjoge1xuICAgICAgICB1c2VybmFtZTogc3RyaW5nLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7bmFtZTogJ3ByZWZlcnJlZExhbmd1YWdlJyB8ICdyZWdpc3RyYXRpb25Db3VudHJ5JywgdmFsdWU6IHN0cmluZ31bXVxuICAgIH1cbiAgICBhdmFpbGFibGVQcm9maWxlczoge1xuICAgICAgICBuYW1lOiBzdHJpbmcsXG4gICAgICAgIGlkOiBzdHJpbmdcbiAgICB9W11cbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBjbGllbnQgdG9rZW4uIEEgY2xpZW50IHRva2VuIGhhcyB0byBiZSB2aXJ0dWFsbHkgaW1wb3NzaWJsZSB0byBiZSB0aGUgc2FtZSBmb3IgYW55IDIgY2xpZW50cy5cbiAqXG4gKiBAcGFyYW0gbmFtZSBUaGUgY2xpZW50IG5hbWUuXG4gKiBAcGFyYW0gdmVyc2lvbiBUaGUgY2xpZW50IHZlcnNpb24uXG4gKiBAcGFyYW0gdGltZSBUaGUgdGltZS5cbiAqIEBwYXJhbSBudW1iZXIgUmFuZG9tIG51bWJlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlQ2xpZW50VG9rZW4oXG4gICAgbmFtZSA9ICdtb2phbmcuanMnLFxuICAgIHZlcnNpb24gPSBVdGlsLnBhY2thZ2VEZXRhaWxzLnZlcnNpb24sXG4gICAgdGltZSA9IERhdGUubm93KCksXG4gICAgbnVtYmVyID0gY3J5cHRvLnJhbmRvbUludCgwLCA0Mjk0OTY3Mjk2KVxuKTogc3RyaW5nIHtcbiAgICBjb25zdCBoYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTUxMicpO1xuICAgIGhhc2gud3JpdGUobmFtZS50b1N0cmluZygpKTtcbiAgICBoYXNoLndyaXRlKHZlcnNpb24udG9TdHJpbmcoKSk7XG4gICAgaGFzaC53cml0ZSh0aW1lLnRvU3RyaW5nKCkpO1xuICAgIGhhc2gud3JpdGUobnVtYmVyLnRvU3RyaW5nKCkpO1xuICAgIHJldHVybiBoYXNoLmRpZ2VzdCgpLnRvU3RyaW5nKCdoZXgnKTtcbn1cblxuZXhwb3J0IGNsYXNzIENsaWVudCBleHRlbmRzIEJhc2VDbGllbnQge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgY2xpZW50VG9rZW46IHN0cmluZ1xuICAgIHByaXZhdGUgYWNjZXNzVG9rZW4/OiBzdHJpbmdcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdHMgYW4gaW5zdGFuY2Ugb2YgdGhlIFlnZ2RyYXNpbCBBUEkgd3JhcHBlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjbGllbnRUb2tlbiBUaGUgY2xpZW50IHRva2VuIHRvIHVzZS4gSWYgbm90IHByb3ZpZGVkLCBpdCB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNsaWVudFRva2VuOiBzdHJpbmcgPSBnZW5lcmF0ZUNsaWVudFRva2VuKCkpIHtcbiAgICAgICAgc3VwZXIoJ2h0dHBzOi8vYXV0aHNlcnZlci5tb2phbmcuY29tJywgZmFsc2UpOyAvLyBjYW4ndCBoYXZlIGNhY2hpbmcgZm9yIHRoaXNcbiAgICAgICAgdGhpcy5hZ2VudC5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHRoaXMuY2xpZW50VG9rZW4gPSBjbGllbnRUb2tlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjdXJyZW50IGFjY2VzcyB0b2tlbiB0aGF0J3MgdXNlZCBieSBkZWZhdWx0LlxuICAgICAqL1xuICAgIGdldEFjY2Vzc1Rva2VuKCk6IHN0cmluZyB8IE51bGxWYWx1ZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFjY2Vzc1Rva2VuO1xuICAgIH1cblxuICAgIGdldENsaWVudFRva2VuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudFRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF1dGhlbnRpY2F0ZXMgdGhpcyBjbGllbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdXNlcm5hbWUgVGhlIHVzZXJuYW1lIGZvciB0aGVcbiAgICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkXG4gICAgICogQHBhcmFtIHVzZSBXaGV0aGVyIG9yIG5vdCB0byBzZXQgdGhpcyBjbGllbnRzIHRva2VucyB0byB0aGUgdG9rZW5zIGZyb20gdGhlIHJlc3BvbnNlLlxuICAgICAqIEBwYXJhbSBjbGllbnRUb2tlbiBUaGUgY2xpZW50IHRva2VuIHRvIHVzZS4gVGhpcyBpcyBhdXRvbWF0aWNhbGx5IHNldCBieSBtb2phbmcuanMsIGFuZCBpcyBub3QgcmVjb21tZW5kZWQgdG8gc3BlY2lmeSBtYW51YWxseS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPEF1dGhlbnRpY2F0aW9uUmVzcG9uc2U+fSBUaGUgcmF3IHJlc3BvbnNlIGZyb20gdGhlIEFQSS5cbiAgICAgKiBAdG9kbyBNYWtlIHRoZSByYXcgcmVzcG9uc2UgbW9yZSBmaXQgZm9yIHRoZSBlbmQgdXNlci5cbiAgICAgKi9cbiAgICBhdXRoZW50aWNhdGUodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgdXNlID0gdHJ1ZSwgY2xpZW50VG9rZW4gPSB0aGlzLmNsaWVudFRva2VuKTogUHJvbWlzZTxBdXRoZW50aWNhdGlvblJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvc3QoJy9hdXRoZW50aWNhdGUnKVxuICAgICAgICAgICAgICAgIC5zZW5kKHtcbiAgICAgICAgICAgICAgICAgICAgYWdlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdNaW5lY3JhZnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogMVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50VG9rZW46IGNsaWVudFRva2VuLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0VXNlcjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlczogQXV0aGVudGljYXRpb25SZXNwb25zZSA9IHJlc3BvbnNlLmJvZHk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSByZXMuYWNjZXNzVG9rZW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlcyBhbiBhY2Nlc3MgdG9rZW4uXG4gICAgICogQHBhcmFtIGFjY2Vzc1Rva2VuIFRoZSBhY2Nlc3MgdG9rZW4gdG8gdmFsaWRhdGUuXG4gICAgICogQHBhcmFtIGNsaWVudFRva2VuIFRoZSBjbGllbnQgdG9rZW4gdG8gY2hlY2sgYWdhaW5zdC4gSWYgc3BlY2lmaWVkLCBpdCBtdXN0IG1hdGNoIHRoZSBvbmUgdXNlZCB0byBhdXRoZW50aWNhdGUgdGhlIGFjY2VzcyB0b2tlbiBpbiB0aGUgZmlyc3QgcGxhY2UuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59IFRydWUgaWYgdGhlIGFjY2VzcyB0b2tlbiBpcyB2YWxpZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHZhbGlkYXRlQWNjZXNzVG9rZW4oYWNjZXNzVG9rZW46IHN0cmluZyB8IE51bGxWYWx1ZSA9IHRoaXMuYWNjZXNzVG9rZW4sIGNsaWVudFRva2VuOiBzdHJpbmcgfCBOdWxsVmFsdWUgPSB0aGlzLmNsaWVudFRva2VuKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWFjY2Vzc1Rva2VuKSByZWplY3QoJ05vIGFjY2VzcyB0b2tlbiBzcGVjaWZpZWQhJyk7XG4gICAgICAgICAgICBlbHNlIHRoaXMucG9zdCgnL3ZhbGlkYXRlJylcbiAgICAgICAgICAgICAgICAub2soKHJlcykgPT4gcmVzLnN0YXR1cyA8IDQwMCB8fCByZXMuc3RhdHVzID09IDQwMylcbiAgICAgICAgICAgICAgICAuc2VuZCh7XG4gICAgICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50VG9rZW46IGNsaWVudFRva2VuXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMubm9Db250ZW50KSByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXMuZm9yYmlkZGVuKSByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBVdGlsLndhcm4oJ1Jlc3BvbnNlIGhhcyBhIG5vbmUtMjA0IG9yIDQwMyBzdGF0dXMgY29kZSwgYXV0b21hdGljYWxseSBkZXRlY3RpbmcuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyA8IDQwMCkgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWZyZXNoZXMgYW4gYWNjZXNzIHRva2VuLlxuICAgICAqIElmIHRoZSBhY2Nlc3MgdG9rZW4gd2FzIGF1dGhlbnRpY2F0ZWQgd2l0aCBhIGRpZmZlcmVudCBjbGllbnQgdG9rZW4sIGl0IG11c3QgYmUgc3BlY2lmaWVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFjY2Vzc1Rva2VuIFRoZSBhY2Nlc3MgdG9rZW4gdG8gcmVmcmVzaC5cbiAgICAgKiBAcGFyYW0gY2xpZW50VG9rZW4gVGhlIGNsaWVudCB0b2tlbiB1c2VkIHRvIGF1dGhlbnRpY2F0ZSB0aGUgYWNjZXNzIHRva2VuIGluIHRoZSBmaXJzdCBwbGFjZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFJlZnJlc2hSZXNwb25zZT59IFRoZSByZWZyZXNoIHJlc3BvbnNlLlxuICAgICAqL1xuICAgIHJlZnJlc2hBY2Nlc3NUb2tlbihhY2Nlc3NUb2tlbjogc3RyaW5nIHwgTnVsbFZhbHVlID0gdGhpcy5hY2Nlc3NUb2tlbiwgY2xpZW50VG9rZW46IHN0cmluZyA9IHRoaXMuY2xpZW50VG9rZW4pOiBQcm9taXNlPFJlZnJlc2hSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8QXV0aGVudGljYXRpb25SZXNwb25zZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFhY2Nlc3NUb2tlbikgcmVqZWN0KCdObyBhY2Nlc3MgdG9rZW4gc3BlY2lmaWVkIScpO1xuICAgICAgICAgICAgZWxzZSB0aGlzLnBvc3QoJy9yZWZyZXNoJylcbiAgICAgICAgICAgICAgICAuc2VuZCh7XG4gICAgICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50VG9rZW46IGNsaWVudFRva2VuLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0VXNlcjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UuYm9keSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0ZXMgYWxsIGFjY2VzcyB0b2tlbnMgZm9yIGFuIGFjY291bnQuXG4gICAgICpcbiAgICAgKiA+ICoqTk9URSoqPGJyPlxuICAgICAqID4gVGhpcyBtYXkgY2F1c2UgYW4gaW5jb252ZW5pZW5jZSB0byB0aGUgdXNlci4gVXNlIHdpdGggY2FyZS5cbiAgICAgKiA+IFRvIGludmFsaWRhdGUgYSBzaW5nbGUgYWNjZXNzIHRva2VuLCB1c2Uge0BsaW5rIENsaWVudC5pbnZhbGlkYXRlQWNjZXNzVG9rZW59XG4gICAgICpcbiAgICAgKiBAc2VlIENsaWVudC5pbnZhbGlkYXRlQWNjZXNzVG9rZW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgdXNlcm5hbWUgb2YgdGhlIHBsYXllciB0byBzaWduIG91dC5cbiAgICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIG9mIHRoZSBwbGF5ZXIgdG8gc2lnbiBvdXQuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IE5vdGhpbmcuXG4gICAgICovXG4gICAgc2lnbm91dCh1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvc3QoJy9zaWdub3V0JylcbiAgICAgICAgICAgICAgICAuc2VuZCh7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5ub0NvbnRlbnQpIFV0aWwud2FybignUmVzcG9uc2UgaXMgbm90IG5vQ29udGVudCcpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0ZXMgYW4gYWNjZXNzIHRva2VuLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFjY2Vzc1Rva2VuIFRoZSBhY2Nlc3MgdG9rZW4gdG8gaW52YWxpZGF0ZS5cbiAgICAgKiBAcGFyYW0gY2xpZW50VG9rZW4gVGhlIGNsaWVudCB0b2tlbiB1c2VkIHRvIGF1dGhlbnRpY2F0ZSB0aGUgYWNjZXNzIHRva2VuIGluIHRoZSBmaXJzdCBwbGFjZS5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gTm90aGluZy5cbiAgICAgKi9cbiAgICBpbnZhbGlkYXRlQWNjZXNzVG9rZW4oYWNjZXNzVG9rZW46IHN0cmluZyB8IE51bGxWYWx1ZSA9IHRoaXMuYWNjZXNzVG9rZW4sIGNsaWVudFRva2VuOiBzdHJpbmcgPSB0aGlzLmNsaWVudFRva2VuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWFjY2Vzc1Rva2VuKSByZWplY3QoJ05vIGFjY2VzcyB0b2tlbiBzcGVjaWZpZWQhJyk7XG4gICAgICAgICAgICBlbHNlIHRoaXMucG9zdCgnL2ludmFsaWRhdGUnKVxuICAgICAgICAgICAgICAgIC5zZW5kKHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRUb2tlbjogY2xpZW50VG9rZW5cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm5vQ29udGVudCkgVXRpbC53YXJuKCdSZXNwb25zZSBpcyBub3Qgbm9Db250ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG59Il19