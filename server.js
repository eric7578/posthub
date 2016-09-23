import 'whatwg-fetch';
import 'babel-polyfill';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import passport from 'koa-passport';
import convert from 'koa-convert';
import views from 'koa-views';
import serve from 'koa-static';
import mount from 'koa-mount';
import graphqlHTTP from 'koa-graphql';

import schema from './graphql/schemas';

const app = new Koa();
const port = process.env.PORT || '3000';
const env = process.env.NODE_ENV || 'development';

app.use(serve(`${__dirname}/public`))

app.use(bodyParser());

app.keys = ['secret'];
app.use(convert(session(app)));

app.use(passport.initialize());
app.use(passport.session());

app.use(views(`${__dirname}/views`, {
  map: { hbs: 'handlebars' },
  options: {
    helpers: {
      toGlobal: context => {
        const vars = [];
        for (let varName in context) {
          vars.push(`window.${varName}=${JSON.stringify(context[varName])};`);
        }
        return ';' + vars.join('');
      }
    }
  }
}));

app.use(mount('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
})));

// import React from 'react';
// import ssr from './utils/ssr.js';
// import Index from './views/index/Index.jsx';
// app.use(ssr(<Index />, 'index'));

app.listen(port, onListening);

function onListening() {
  console.log(`Listening on ${port}`);
}
