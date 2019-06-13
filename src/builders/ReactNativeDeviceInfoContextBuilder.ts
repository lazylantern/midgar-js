import DeviceInfo from 'react-native-device-info';
import Context from '../models/context';
import IContextBuilder from "./IContextBuilder";

class ReactNativeDeviceInfoContextBuilder implements IContextBuilder{

    public buildContext(): Context {

        return new Context(
            this.getUniqueId(),
            this.getApplicationName(),
            this.getVersionName(),
            this.getVersionCode(),
            this.getOsVersion(),
            this.getDeviceCountry(),
            this.getDeviceModel(),
            this.getDeviceManufacturer(),
            this.isEmulator()
        );
    }

    getUniqueId(): string {
        return DeviceInfo.getUniqueID();
    }

    getApplicationName(): string {
        return DeviceInfo.getApplicationName();
    }

    getDeviceModel(): string {
        return DeviceInfo.getDeviceId();
    }

    getDeviceManufacturer(): string {
        return DeviceInfo.getManufacturer();
    }

    getVersionName(): string {
        return DeviceInfo.getReadableVersion();
    }

    getVersionCode(): string {
        return DeviceInfo.getBuildNumber();
    }

    getOsVersion(): string {
        return DeviceInfo.getSystemVersion();
    }

    getDeviceCountry(): string {
        return DeviceInfo.getDeviceCountry();
    }

    isEmulator(): boolean {
        return DeviceInfo.isEmulator();
    }
}

export default ReactNativeDeviceInfoContextBuilder;
