const Router = require('koa-router');
const replyCtrl = require('./reply.ctrl');
const getPostById = require('../../middleware/getPostById');

const reply = new Router();

reply.post('/', replyCtrl.writeReply);

const re = new Router();
re.get('/', replyCtrl.readAllReply);
re.delete('/', replyCtrl.deleteReply);
re.patch('/', replyCtrl.updateReply);

reply.use('/:id', re.routes());

module.exports = reply;
