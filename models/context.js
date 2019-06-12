export default class Context {
  constructor(deviceId, appName, versionName, versionCode, osVersion,
    deviceCountry, model, manufacturer, isEmulator) {
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
