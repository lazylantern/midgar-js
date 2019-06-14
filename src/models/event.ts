import Context from "./context";

export default class Event {
  public screen: string;
  public platform: string;
  public sdk: string;
  public type: string;
  public timestamp: number;
  public session_id: string;
  public constructor(
    screen: string,
    platform: string,
    sdk: string,
    type: string,
    timestamp: number,
    sessionId: string,
    context: Context
  ) {
    this.screen = screen;
    this.platform = platform;
    this.type = type;
    this.timestamp = timestamp;
    this.sdk = sdk;
    this.session_id = sessionId;
    Object.assign(this, context);
  }
}
