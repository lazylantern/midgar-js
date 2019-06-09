export default class MidgarApi {
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
