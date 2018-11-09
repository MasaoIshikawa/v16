import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import App from './containers/App';
import ScrollToTop from './components/ScrollToTop';
import configureStore from './store';
import { unregister } from './registerServiceWorker';

const history = createHistory();
const store = configureStore({

}, history);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
unregister();
