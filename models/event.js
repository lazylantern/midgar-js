export default class Event {
  constructor(screen, platform, sdk, type, timestamp, sessionId, context) {
    this.screen = screen;
    this.platform = platform;
    this.type = type;
    this.timestamp = timestamp;
    this.sdk = sdk;
    this.session_id = sessionId;
    Object.assign(this, context);
  }
}
