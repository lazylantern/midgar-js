import React, {Component} from 'react';
import {NavigationContainer} from "react-navigation";
import MidgarTracker from './midgar'

const withExtendedContainer = <P extends object>(NavContainer: NavigationContainer): NavigationContainer => {
    // @ts-ignore
    return class WithMidgar extends NavContainer {

        componentDidMount(): void {
            let routeName = '';
            try {
                // @ts-ignore
                routeName = this.state.nav.routes[0].routeName
            } catch (e) { }
            MidgarTracker.manuallyTrackScreen(routeName);
        }

        render() {
            return super.render();
        }
    };
};

const withProps = <P extends object>(NavContainer: NavigationContainer) =>
    class WithMidgar extends React.Component<P> {

        render() {
            return <NavContainer onNavigationStateChange={(prevState, currentState) => {
                MidgarTracker.trackScreen(prevState, currentState);
            }}/>;
        }
    };


export default (WrappedComponent: NavigationContainer) =>
    withProps(withExtendedContainer(WrappedComponent))
