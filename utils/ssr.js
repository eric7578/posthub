import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import configureStore from '../views/redux/configureStore';

export function ssr(component, entry, template = 'react.hbs') {
  return async function (ctx, next) {
    await ctx.rener(template, {
      reactContent: renderToString(component)
    });
  }
}

export function ssrContainer(componetn, entry, template='react.hbs') {
  return async function (ctx, next) {
    const { engine } = ctx.state;
    if (!engine || !engine.initState) {
      throw new Error('invalid initState on engine');
    }

    const store = configureStore({ ...engine.initState });
    await ctx.render(template, {
      engine: JSON.stringify(engine),
      entry,
      reactContent: renderToString(
        <Provider store={store}>
          {component}
        </Provider>
      )
    });
  }
}
