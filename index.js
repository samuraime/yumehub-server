const Koa = require('koa');
const body = require('koa-body');
const staticServe = require('koa-static');
const config = require('./config');
const connect = require('./utils/connect');

// connect to mongodb
connect();

const app = new Koa();

// routes must be place after models
const router = require('./routes');

app.use(body());

app.use(staticServe(config.publicPath));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port);
console.log(`Listening on port ${config.port}`);
