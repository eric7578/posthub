import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from '../reducer';

function logger() {
  return next => action => {
    const { type, ...others } = action
    console.log(type, others);
    next(action);
  };
}

export default function configureStore(initState) {
  const sagaMiddleware = createSagaMiddleware()
  return {
    ...createStore(
      reducers,
      initState || {},
      applyMiddleware(sagaMiddleware, logger)
    ),
    runSaga: sagaMiddleware.run
  };
}
