const Router = require('koa-router');
const userCtrl = require('./user.ctrl');

const user = new Router();

user.get('/:id', userCtrl.getUserInfo); //체크는 다름 get으로해야함
//유저정보를 어렵게 받아오고잇어서 유저정볼르 받아오는 컨트롤만드는거 좋음
module.exports = user;
