/**
 * Created by Taha on 02/22/18.
 */

import {
  createStore,
  compose,
  applyMiddleware,
} from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
// import { createLogger } from 'redux-logger';
import { refreshTokenMiddleware } from 'utils/refreshTokenMiddleware';

import rootReducer from '../reducers';
import rootSaga from '../sagas';

export default function configureStore(initialState, history) {
  const sagaMiddleware = createSagaMiddleware();
  // const loggerMiddleware = createLogger();

  const middleware = compose(
    applyMiddleware(
      refreshTokenMiddleware,
      sagaMiddleware,
      // loggerMiddleware,
      routerMiddleware(history)
    ),

    process.env.NODE_ENV === 'development' &&
    typeof window === 'object' &&
    typeof window.devToolsExtension !== 'undefined'
      ? window.devToolsExtension()
      : f => f
  );

  const store = createStore(
    rootReducer,
    middleware
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
