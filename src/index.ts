import { NavigationState } from 'react-navigation';
import MidgarManager from './manager';

export default class MidgarTracker {
    private manager: MidgarManager;

    public constructor(appId: string) {
        this.manager = new MidgarManager(appId);
    }

    public init() {
        try {
            this.manager.start();
        } catch (e) {
            console.error(e);
        }
    }

    public trackScreen(prevState: NavigationState, currentState: NavigationState) {
        try {
            this.manager.trackScreenFromRoute(prevState, currentState);
        } catch (e) {
            console.error(e);
        }
    }

    // track screen with given name
    public manuallyTrackScreen(screen: string) {
        try {
            this.manager.trackScreen(screen);
        } catch (e) {
            console.error(e);
        }
    }

    public killSwitch() {
        try {
            this.manager.stop();
        } catch (e) {
            console.error(e);
        }
    }
}
