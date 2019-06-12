import Event from './models/event';

export default class MidgarApi {
    private BASE_URL = 'https://midgar-flask.herokuapp.com/api';

    private readonly appId: string;

    public constructor(appId: string) {
        this.appId = appId;
    }

    public checkAppIsEnabled(): Promise<Response> {
        return this.postRequest('/apps/kill', {
            app_token: this.appId
        });
    }

    public uploadBatch(events: Event[]): Promise<Response> {
        return this.postRequest('/events', {
            app_token: this.appId,
            events
        });
    }

    private postRequest(endpoint: string, params: Record<string, any>): Promise<Response> {
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
