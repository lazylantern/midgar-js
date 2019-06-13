import Constants from 'expo-constants';
import Context from '../models/context';
import IContextBuilder from "./IContextBuilder";

class ExpoContextBuilder implements IContextBuilder{

    platform = Constants.platform;

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

    getUniqueId(): string | undefined {
        return Constants.deviceId ;
    }

    getApplicationName(): string | undefined {
        return Constants.manifest.name;
    }

    getDeviceModel(): string | undefined {
        if(this.platform != null && this.platform.ios){
            return this.platform.ios.model;
        }
    }

    getDeviceManufacturer(): string | undefined {
        if(this.platform != null && this.platform.ios){
            return 'Apple';
        }
    }

    getVersionName(): string | undefined {
        return Constants.manifest.version;
    }

    getVersionCode(): string | undefined {
        if(this.platform != null && this.platform.android){
            return String(this.platform.android.versionCode);
        }

    }

    getOsVersion(): string | undefined {
        if(this.platform != null && this.platform.ios){
            return this.platform.ios.systemVersion;
        }
        return "";
    }

    getDeviceCountry(): string | undefined {
        return undefined;
    }

    isEmulator(): boolean | undefined {
        return !Constants.isDevice;
    }
}

export default ExpoContextBuilder;
