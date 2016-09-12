import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import passport from 'koa-passport';
import convert from 'koa-convert';
import views from 'koa-views';

const app = new Koa();
const port = process.env.PORT || '3000';
const env = process.env.NODE_ENV || 'development';

app.use(bodyParser());

app.keys = ['secret'];
app.use(convert(session(app)));

app.use(passport.initialize());
app.use(passport.session());

app.use(views(`${__dirname}/views`, {
  map: { hbs: 'handlebars' }
}));

app.use(async ctx => {
  await ctx.render('index.hbs');
});

app.use(async (ctx, next) => {
  ctx.body = 'hello';
});

app.listen(port, onListening);

function onListening() {
  console.log(`Listening on ${port}`);
}
