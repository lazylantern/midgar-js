class Event {
  constructor(screen, source, type, timestamp) {
    this.screen = screen;
    this.source = source;
    this.type = type;
    this.timestamp = timestamp;
  }
}

class MidgarApi {
  BASE_URL = 'https://midgar-flask.herokuapp.com/api';

  constructor(appId) {
    this.appId = appId;
  }

  checkAppIsEnabled() {
    return this.postRequest('/apps/kill', {
      app_token: this.appId
    });
  }

  uploadBatch(events) {
    return this.postRequest('/events', {
      app_token: this.appId,
      events
    });
  }

  postRequest(endpoint, params) {
    const url = this.BASE_URL + endpoint;
    const body = JSON.stringify(params);
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8'
    };

    return fetch(
      url,
      {
        headers,
        body,
        method: 'POST'
      }
    );
  }
}

class MidgarManager {
  static MAX_UPLOAD_BATCH_SIZE = 10;

  static UPLOAD_PERIOD_MS = 60 * 1000;

  events = [];

  hasBeenRemotelyEnabled = null;

  constructor(appId) {
    this.appId = appId;
  }

  start() {
    this.api = new MidgarApi(this.appId);
    this.api.checkAppIsEnabled().then(
      (response) => {
        if (response.ok) {
          this.hasBeenRemotelyEnabled = true;
          const self = this;
          this.timerId = setInterval(() => {
            const batch = self.events.splice(0, MidgarManager.MAX_UPLOAD_BATCH_SIZE);
            if (batch.length > 0) {
              self.api.uploadBatch(batch).then(
                (uploadResponse) => {
                  if (__DEV__) {
                    if (uploadResponse.ok) {
                      console.info('Events successfully uploaded');
                    } else {
                      console.info('Something went wrong. Events got dropped.');
                    }
                  }
                }
              );
            }
          }, MidgarManager.UPLOAD_PERIOD_MS);
        } else {
          this.stop();
        }
      }
    );
  }

  stop() {
    this.hasBeenRemotelyEnabled = false;
    clearInterval(this.timerId);
    this.events = [];
  }

  trackScreen(screen) {
    if (this.isAllowedToCollectEvents()) {
      this.events.push(this.createEvent(screen));
    }
  }

  trackScreenFromRoute(prevState, currentState) {
    if (!this.isAllowedToCollectEvents()) {
      return false;
    }
    const currentScreen = this.getActiveRouteName(currentState);
    const prevScreen = this.getActiveRouteName(prevState);

    if (prevScreen !== currentScreen) {
      this.trackScreen(this.getActiveRouteName(currentState));
    }
  }

  getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRouteName(route);
    }
    return route.routeName;
  }

  isAllowedToCollectEvents() {
    return this.hasBeenRemotelyEnabled == null || this.hasBeenRemotelyEnabled === true;
  }

  createEvent(screen) {
    return new Event(screen, 'js', 'impression', new Date().getTime());
  }
}

export default class MidgarTracker {
  init(appId) {
    try {
      this.manager = new MidgarManager(appId);
      this.manager.start();
    } catch (e) {
      console.error(e);
    }
    return this;
  }

  trackScreen(prevState, currentState) {
    try {
      this.manager.trackScreenFromRoute(prevState, currentState);
    } catch (e) {
      console.error(e);
    }
  }

  // track screen with given name
  manuallyTrackScreen(screen) {
    try {
      this.manager.trackScreen(screen);
    } catch (e) {
      console.error(e);
    }
  }

  killSwitch() {
    try {
      this.manager.stop();
    } catch (e) {
      console.error(e);
    }
  }
}
