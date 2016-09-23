import { createStore, applyMiddleware } from 'redux';

import reducers from '../reducer';

function logger() {
  return next => action => {
    const { type, ...others } = action
    console.log(type, others);
    next(action);
  };
}

export default function configureStore(initState) {
  return createStore(
    reducers,
    initState || {},
    applyMiddleware(logger)
  );
}
