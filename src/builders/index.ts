import IContextBuilder from "./IContextBuilder";

function getContextBuilder(){
    try {
        return require('./ReactNativeDeviceInfoContextBuilder');
    } catch (e) {
        console.warn("react-native-device-info module is not available")
    }
    try {
        return require('./ExpoContextBuilder');
    }
    catch (e) {
        console.warn('expo module is not available')
    }

    return require('UndefinedContextBuilder')
}

export default function (): IContextBuilder{
    return getContextBuilder();
}
