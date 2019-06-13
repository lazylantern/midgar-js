import { NavigationState } from 'react-navigation';
import MidgarManager from './manager';

class MidgarTracker {
    private manager?: MidgarManager;

    public init(appId: string): void {
        try {
            this.manager = new MidgarManager(appId);
            this.manager.start();
        } catch (e) {
            console.error(e);
        }
    }

    public trackScreen(prevState: NavigationState, currentState: NavigationState): void {
        try {
            if (this.manager == null) {
                return;
            }
            this.manager.trackScreenFromRoute(prevState, currentState);
        } catch (e) {
            console.error(e);
        }
    }

    // track screen with given name
    public manuallyTrackScreen(screen: string): void {
        try {
            if (this.manager == null) {
                return;
            }
            this.manager.trackScreen(screen);
        } catch (e) {
            console.error(e);
        }
    }

    public killSwitch(): void {
        try {
            if (this.manager == null) {
                return;
            }
            this.manager.stop();
        } catch (e) {
            console.error(e);
        }
    }
}

export default new MidgarTracker();
