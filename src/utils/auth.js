import React from "react";
import {Route} from "react-router-dom";
import {Store} from "../service/user";
import {getItem} from "./storage";

export default function Auth(props) {
    const {location, history} = props;
    const isLogin = getItem('user');
    console.log('isLogin', isLogin, location, history);
    // if (isLogin) {
    //     location.pathname === '/' && history.replace('/merchant');
    // } else {
    //     location.pathname !== '/' && history.replace('/');
    // }
    return (
        <div/>
    )
}

const store = new Store();

function RouteWithSubRoutes(route) {
    return (
        <Route
            path={route.path}
            render={props => (
                // pass the sub-routes down to keep nesting
                <route.component props={props} {...props} routes={route.routes} store={store}/>
            )}
        />
    );
}
