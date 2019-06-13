import Context from "../models/context";

export default interface IContextBuilder {
    buildContext(): Context;
    getUniqueId(): string | undefined
    getApplicationName(): string | undefined
    getDeviceModel(): string | undefined
    getDeviceManufacturer(): string | undefined
    getVersionName(): string | undefined
    getVersionCode(): string | undefined
    getOsVersion(): string | undefined
    getDeviceCountry(): string | undefined
    isEmulator(): boolean | undefined
}
