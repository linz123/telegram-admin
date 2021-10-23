// import logo from './logo.svg';
import './App.css';
import RouterConfig from './router/router';
import React, {createContext} from "react";
import {ConfigProvider} from "antd";


import 'moment/locale/zh-cn';
import locale from 'antd/lib/locale/zh_CN';

function App(props) {

    console.log('App-props', props);
    return (
        <ConfigProvider locale={locale}>
            <RouterConfig/>
        </ConfigProvider>

        // <div className="App">
        //   <header className="App-header">
        //     <img src={logo} className="App-logo" alt="logo" />
        //     <p>
        //       Edit <code>src/App.js</code> and save to reload.
        //     </p>
        //     <a
        //       className="App-link"
        //       href="https://reactjs.org"
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       Learn React
        //     </a>
        //   </header>
        // </div>
    );
}

export default App;
