const Router = require('koa-router');
const posts = require('./posts');
const auth = require('./auth');
const reply = require('./reply');
const user = require('./user');
const api = new Router();

api.use('/posts', posts.routes());
api.use('/auth', auth.routes());
api.use('/reply', reply.routes());
api.use('/user', user.routes());
//export default 사용안함
module.exports = api;
