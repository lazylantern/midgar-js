class Event {
    constructor(screen, source, type, date){
        this.screen = screen;
        this.source = source;
        this.type = type;
        this.date = date;
    }
}

class MidgarApi {
    static BASE_URL = "http://midgar-flask.herokuapp.com/api"

    constructor(appId){
        this.appId = appId
    }

    checkAppIsEnabled(){
        return this.postRequest("/apps/kill", {
            app_token:this.appId
        })
    }

    uploadBatch(events){
        return this.postRequest("/events", {
            app_token:this.appId,
            events: events
        })
    }

    postRequest(endpoint, params){
        const url = MidgarApi.BASE_URL + endpoint
        const body = params
        const headers = {
            "Content-Type": "application/json; charset=UTF-8"
        }

        return fetch(
            url,
            {
                headers: headers,
                body: body,
                method: "POST"
            }
        )
    }
}

class MidgarManager {

    events = [];
    hasBeenRemotelyEnabled = false;

    constructor(appId){
        this.appId = appId
    }

    start(){
        this.api = new MidgarApi(this.appId)
    }

    stop(){
        this.hasBeenRemotelyEnabled = false
        this.events = []
    }

    trackScreen(screen){
        if(this.hasBeenRemotelyEnabled){
            this.events.push(this.createEvent(screen))
        }
    }

    createEvent(screen){
        return new Event(screen, "js", "impression", new Date().getTime())
    }

}

export default class MidgarTracker {

    init(appId){
        this.manager = new MidgarManager(appId)
        this.manager.start()
    }

    trackScreen(screen){
        this.manager.trackScreen(screen)
    }

    killSwitch(){
        this.manager.stop()
    }
}