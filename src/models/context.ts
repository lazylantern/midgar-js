export default class Context {
    public device_id: string;
    public app_name: string;
    public version_name: string;
    public version_code: string;
    public os_version: string;
    public device_country: string;
    public model: string;
    public manufacturer: string;
    public is_emulator: boolean;
    public constructor(deviceId: string, appName: string, versionName: string, versionCode: string,
        osVersion: string, deviceCountry: string, model: string, manufacturer: string,
        isEmulator: boolean) {
        this.device_id = deviceId;
        this.app_name = appName;
        this.version_name = versionName;
        this.version_code = versionCode;
        this.os_version = osVersion;
        this.device_country = deviceCountry;
        this.model = model;
        this.manufacturer = manufacturer;
        this.is_emulator = isEmulator;
    }
}
