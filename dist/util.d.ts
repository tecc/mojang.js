export declare type NullValue = undefined | null;
export declare type PackageDetails = {
    version: string;
};
export declare const packageDetails: PackageDetails;
export declare function isUuid(uuid: string): boolean;
export declare function cleanUuid(uuid: string): string;
export declare function expandUuid(uuid: string): string;
export declare function base64Decode(data: string): string;
export declare function base64Encode(data: any): string;
export declare function warn(...msg: any): void;
