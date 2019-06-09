import DeviceInfo from 'react-native-device-info';
import Context from './models/context';

function buildContext() {
  return new Context(
    getApplicationName(),
    getVersionName(),
    getVersionCode(),
    getOsVersion(),
    getDeviceCountry(),
    getDeviceModel(),
    getDeviceManufacturer(),
    isEmulator()
  );
}

function getApplicationName() {
  return DeviceInfo.getApplicationName();
}

function getDeviceModel() {
  return DeviceInfo.getDeviceId();
}


function getDeviceManufacturer() {
  return DeviceInfo.getManufacturer();
}

function getVersionName() {
  return DeviceInfo.getReadableVersion();
}

function getVersionCode() {
  return DeviceInfo.getBuildNumber();
}


function getOsVersion() {
  return DeviceInfo.getSystemVersion();
}

function getDeviceCountry() {
  return DeviceInfo.getDeviceCountry();
}

function isEmulator() {
  return DeviceInfo.isEmulator();
}

export default buildContext();
