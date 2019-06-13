export default class Context {
    public device_id: string | undefined;
    public app_name: string | undefined;
    public version_name: string | undefined;
    public version_code: string | undefined;
    public os_version: string | undefined;
    public device_country: string | undefined;
    public model: string | undefined;
    public manufacturer: string | undefined;
    public is_emulator: boolean | undefined;
    public constructor(deviceId: string | undefined, appName: string | undefined, versionName: string | undefined,
                       versionCode: string | undefined, osVersion: string | undefined,
                       deviceCountry: string | undefined, model: string | undefined, manufacturer: string | undefined,
                       isEmulator: boolean | undefined) {
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
