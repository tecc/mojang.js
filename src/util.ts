import * as UUID from 'uuid';

export type NullValue = undefined | null;

export function validate(uuid: string): boolean {
    return UUID.validate(uuid) || UUID.validate(expandUuid(uuid));
}
export function cleanUuid(uuid: string): string {
    return uuid.replace('-', '');
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