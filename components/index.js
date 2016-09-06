import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { makeDOMDriver, div, input, p } from '@cycle/dom';

function main(sources) {
  const sinks = {
    DOM: xs.of(false)
      .map(toggled =>
        div([
          input({attrs: {type: 'checkbox'}}), 'Toggle me',
          p(toggled ? 'ON' : 'off')
        ])
      )
  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);
