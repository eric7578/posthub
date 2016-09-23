import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import 'whatwg-fetch';
import promise from 'es6-promise';
promise.polyfill();

import "normalize.css";

import configureStore from '../views/redux/configureStore';

export function mount(component) {
  const root = document.getElementById('root');
  render(component, root);
}

export function mountContainer(component, initState) {
  const root = document.getElementById('root');

  if (!initState) {
    throw new Error('invalid initState');
  }

  const store = configureStore(initState);
  const provider = (
    <Provider store={store}>
      {component}
    </Provider>
  );

  render(provider, root);
}
