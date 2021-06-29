import { BaseClient } from './BaseClient';

export class YggdrasilClient extends BaseClient {
    constructor() {
        super('https://authserver.mojang.com');
        throw new Error('Yggdrasil support is not yet done!');
    }
}