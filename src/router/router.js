import React from "react";
import {Route, withRouter, Switch} from "react-router-dom";
import Login from '../components/Login/login';
import Layout from "../layouts/layout";
import {Store} from "../service/user";
import {getItem} from "../utils/storage";
import Merchant from '../pages/merchant/merchant';


const routes = [
    {
        path: "/",
        component: Login,
        exact: true,
        auth: false
    },
    {
        path: "/user",
        component: Layout,
        auth: true
    },

];

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


export default withRouter(props => {
    console.log('withRouter-props', props)
    const {history, location} = props;
    const isLogin = getItem('user');
    history.listen((location) => {
        // console.log('listen', location);
        // if (!isLogin) {
        //     history.push('/');
        // }
        // if (isLogin) {
        //     location.pathname === '/' && history.push('/user/merchant');
        // } else {
        //     location.pathname !== '/' && history.push('/');
        // }
    })
    if (isLogin) {
        location.pathname === '/' && history.push('/user/merchant');
    } else {
        location.pathname !== '/' && history.push('/');
    }

    return (
        <Switch>
            {routes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} />
            ))}
        </Switch>
    )
})
