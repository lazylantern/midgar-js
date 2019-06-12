/* global __DEV__ */
import { NavigationRoute, NavigationState } from 'react-navigation';
import { AppState, Platform } from 'react-native';
import Event from './models/event';
import MidgarApi from './api';
import Context from './contextBuilder';

function generateSessionId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuv0123456789';
    let result = '';
    for (let i = 6; i > 0; i -= 1) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export default class MidgarManager {
    private static MAX_UPLOAD_BATCH_SIZE = 10;
    private static UPLOAD_PERIOD_MS = 60 * 1000; // 1 minute
    private static SESSION_MAX_LENGTH_MS = 10 * 60 * 1000; // 10 minutes

    private api: MidgarApi;

    private readonly appId: string;
    private events: Event[] = [];
    private sessionId: string;
    private timeOfLastBackgroundEvent = Number.MAX_SAFE_INTEGER;
    private hasBeenKilled: boolean = false;
    private timerId: number = 0;

    public constructor(appId: string) {
        this.appId = appId;
        this.sessionId = generateSessionId();
        this.api = new MidgarApi(appId);
    }

    public start() {
        this.trackAppStateChanges();
        this.api.checkAppIsEnabled().then(
            (response) => {
                if (response.ok) {
                    this.startMonitoring();
                } else {
                    this.stop();
                }
            }
        );
    }

    public stop() {
        this.hasBeenKilled = true;
        AppState.removeEventListener('change', this.trackAppStateChanges);
        clearInterval(this.timerId);
        this.events = [];
    }

    public trackScreen(screen: string) {
        if (this.isAllowedToCollectEvents()) {
            this.events.push(this.createEvent(screen, 'impression'));
        }
    }

    public trackScreenFromRoute(prevState: NavigationState, currentState: NavigationState) {
        if (!this.isAllowedToCollectEvents()) {
            return false;
        }
        const currentScreen = this.getActiveRouteName(currentState);
        const prevScreen = this.getActiveRouteName(prevState);

        if (prevScreen !== currentScreen) {
            this.trackScreen(this.getActiveRouteName(currentState));
        }

        return true;
    }

    private startMonitoring() {
        this.hasBeenKilled = false;
        const self = this;
        this.timerId = setInterval(() => {
            this.processBatch();
        }, MidgarManager.UPLOAD_PERIOD_MS);
    }

    private processBatch() {
        const batch = this.events.splice(0, MidgarManager.MAX_UPLOAD_BATCH_SIZE);
        if (batch.length > 0) {
            this.api.uploadBatch(batch).then(
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
    }

    private checkSessionIdValidity() {
        return new Date().getTime() - this.timeOfLastBackgroundEvent
            < MidgarManager.SESSION_MAX_LENGTH_MS;
    }

    private getSessionId() {
        if (this.sessionId == null || !this.checkSessionIdValidity()) {
            this.sessionId = generateSessionId();
        }

        return this.sessionId;
    }

    private getActiveRouteName(navigationState: NavigationState) {
        return this.getActiveRouteNameFromRoute(navigationState.routes[navigationState.index]);
    }

    private getActiveRouteNameFromRoute(navigationRoute: NavigationRoute): string {
        const route = navigationRoute.routes[navigationRoute.index];
        // dive into nested navigators
        if (route.routes) {
            return this.getActiveRouteNameFromRoute(route);
        }
        return route.routeName;
    }

    private isAllowedToCollectEvents() {
        return !this.hasBeenKilled;
    }

    private createEvent(screen: string, type: string) {
        return new Event(screen, Platform.OS, 'rn', type, new Date().getTime(), this.getSessionId(), Context);
    }

    private trackAppStateChanges() {
        const self = this;
        try {
            AppState.addEventListener('change', (nextAppState) => {
                if (nextAppState === 'background') {
                    self.events.push(this.createEvent('', 'background'));
                    self.timeOfLastBackgroundEvent = new Date().getTime();
                    if (self.isAllowedToCollectEvents()) {
                        // Flush queue when we go to background as the timer will stop
                        self.processBatch();
                    }
                } else if (nextAppState === 'active') {
                    self.events.push(this.createEvent('', 'foreground'));
                }
            });
        } catch (e) {
            console.error(e);
        }
    }
}
