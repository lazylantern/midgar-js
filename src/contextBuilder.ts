import DeviceInfo from 'react-native-device-info';
import Context from './models/context';

class ContextBuilder {
    public buildContext(): Context {
        return new Context(
            ContextBuilder.getUniqueId(),
            ContextBuilder.getApplicationName(),
            ContextBuilder.getVersionName(),
            ContextBuilder.getVersionCode(),
            ContextBuilder.getOsVersion(),
            ContextBuilder.getDeviceCountry(),
            ContextBuilder.getDeviceModel(),
            ContextBuilder.getDeviceManufacturer(),
            ContextBuilder.isEmulator()
        );
    }

    private static getUniqueId(): string {
        return DeviceInfo.getUniqueID();
    }

    private static getApplicationName(): string {
        return DeviceInfo.getApplicationName();
    }

    private static getDeviceModel(): string {
        return DeviceInfo.getDeviceId();
    }

    private static getDeviceManufacturer(): string {
        return DeviceInfo.getManufacturer();
    }

    private static getVersionName(): string {
        return DeviceInfo.getReadableVersion();
    }

    private static getVersionCode(): string {
        return DeviceInfo.getBuildNumber();
    }

    private static getOsVersion(): string {
        return DeviceInfo.getSystemVersion();
    }

    private static getDeviceCountry(): string {
        return DeviceInfo.getDeviceCountry();
    }

    private static isEmulator(): boolean {
        return DeviceInfo.isEmulator();
    }
}

export default new ContextBuilder().buildContext();
