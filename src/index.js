import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Pages
import App from './App';
import Page404 from './pages/Page404';

import * as serviceWorker from './serviceWorker';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Store } from './store';
import GBAScreen from './components/GBAScreen';

ReactDOM.render(
    <HashRouter>
        <Provider store={Store}>
            <Switch>
                <Route path="/" exact={true} component={App} />

                <Route path="/emulator" component={GBAScreen} />

                <Route path='*' component={Page404} />
            </Switch>
        </Provider>
    </HashRouter>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
