import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Login from '../components/Login/login';
import {Store} from '../service/user';
import Layout from "../layouts/layout";


const routes = [

    {
        path: "/",
        exact: true,
        component: Login,
    },
    {
        path: "/",
        component: Layout,
        routes: [
            {
                path: "/merchant",
                component: Merchant
            },
            {
                path: "/Merchant3",
                component: Merchant
            }
        ]
    },

];

const store = new Store();

function RouteWithSubRoutes(route) {
    return (
        <Route
            path={route.path}
            render={props => (
                // pass the sub-routes down to keep nesting
                <route.component {...props} routes={route.routes} store={store}/>
            )}
        />
    );
}

export default function RouterConfig() {
    return (
        <Router>
            <Switch>
                {routes.map((route, i) => (
                    <RouteWithSubRoutes key={i} {...route} />
                ))}
            </Switch>
        </Router>
    )
}

function Merchant() {
    return <h1>Merchant</h1>
}

