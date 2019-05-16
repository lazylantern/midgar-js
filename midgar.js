class Event {
  constructor(screen, source, type, date) {
    this.screen = screen;
    this.source = source;
    this.type = type;
    this.date = date;
  }
}

class MidgarApi {
    BASE_URL = 'http://midgar-flask.herokuapp.com/api';

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
            this.timerId = setInterval(this.processBatch, MidgarManager.UPLOAD_PERIOD_MS);
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

    processBatch() {
      const batch = this.events.splice(MidgarManager.MAX_UPLOAD_BATCH_SIZE);
      this.api.uploadBatch(batch).then(
        (response) => {
          if (__DEV__) {
            if (response.ok) {
              console.log('Events successfully uploaded');
            } else {
              console.log('Something went wrong. Events got dropped.');
            }
          }
        }
      );
    }
}

export default class MidgarTracker {
  init(appId) {
    this.manager = new MidgarManager(appId);
    this.manager.start();
    return this;
  }

  trackScreen(screen) {
    this.manager.trackScreen(screen);
  }

  killSwitch() {
    this.manager.stop();
  }
}
