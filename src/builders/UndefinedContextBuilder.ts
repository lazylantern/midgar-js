import Context from '../models/context';
import IContextBuilder from "./IContextBuilder";

class UndefinedContextBuilder implements IContextBuilder{

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
        return undefined ;
    }

    getApplicationName(): string | undefined {
        return undefined;
    }

    getDeviceModel(): string | undefined {
        return undefined;
    }

    getDeviceManufacturer(): string | undefined {
        return undefined;
    }

    getVersionName(): string | undefined {
        return undefined;
    }

    getVersionCode(): string | undefined {
        return undefined;
    }

    getOsVersion(): string | undefined {
        return undefined;
    }

    getDeviceCountry(): string | undefined {
        return undefined;
    }

    isEmulator(): boolean | undefined {
        return undefined;
    }
}

export default UndefinedContextBuilder;
