import * as UUID from 'uuid';
import * as Base64 from 'base-64';

export type NullValue = undefined | null;
export type PackageDetails = {
    version: string
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const packageDetails: PackageDetails = require('../package.json');

export function isUuid(uuid: string): boolean {
    return UUID.validate(uuid) || UUID.validate(expandUuid(uuid));
}
export function cleanUuid(uuid: string): string {
    return uuid.replace(/-/g, '');
}
export function expandUuid(uuid: string): string {
    let result = '';

    result = '-' + uuid.substr(20, 12) + result;
    result = '-' + uuid.substr(16, 4) + result;
    result = '-' + uuid.substr(12, 4) + result;
    result = '-' + uuid.substr(8, 4) + result;
    result = uuid.substr(0, 8) + result;

    return result;
}

/* Base64 utilities */

export function base64Decode(data: string): string {
    return Base64.decode(data);
}
export function base64encode(data: any): string {
    return Base64.encode(data.toString());
}