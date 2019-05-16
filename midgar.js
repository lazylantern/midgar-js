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

    hasBeenRemotelyEnabled = false;

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
              self.api.uploadBatch(batch).then(
                (uploadResponse) => {
                  if (__DEV__) {
                    if (uploadResponse.ok) {
                      console.log('Events successfully uploaded');
                    } else {
                      console.log('Something went wrong. Events got dropped.');
                    }
                  }
                }
              );
            }, MidgarManager.UPLOAD_PERIOD_MS);
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
      if (this.hasBeenRemotelyEnabled) {
        this.events.push(this.createEvent(screen));
      }
    }

    createEvent(screen) {
      return new Event(screen, 'js', 'impression', new Date().getTime());
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
}

export default class MidgarTracker {
  init(appId) {
    this.manager = new MidgarManager(appId);
    this.manager.start();
    return this;
  }

  // Only track screen if different from previous navigation state. Requires react-navigation
  trackScreen(prevState, currentState) {
    const currentScreen = this.manager.getActiveRouteName(currentState);
    const prevScreen = this.manager.getActiveRouteName(prevState);

    if (prevScreen !== currentScreen) {
      this.manager.trackScreen(currentScreen);
    }
  }

  // track screen with given name
  forceTrackScreen(screen) {
    this.manager.trackScreen(screen);
  }

  killSwitch() {
    this.manager.stop();
  }
}
