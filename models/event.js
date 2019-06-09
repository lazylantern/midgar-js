export default class Event {
  constructor(screen, platform, sdk, type, timestamp, deviceId, sessionId, context) {
    this.screen = screen;
    this.platform = platform;
    this.type = type;
    this.timestamp = timestamp;
    this.sdk = sdk;
    this.device_id = deviceId;
    this.session_id = sessionId;
    Object.assign(this, context);
  }
}