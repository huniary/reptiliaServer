const Router = require('koa-router');
const postCtrl = require('./posts.ctrl');
const checkLoggedIn = require('../../middleware/checkLoggedin');
const getPostById = require('../../middleware/getPostById');
const checkOwnPost = require('../../middleware/checkOwnPost');

const posts = new Router();

//자바로치면 여기가 컨트롤러
posts.get('/', postCtrl.readAllPosts); //데이터 전체
posts.post('/', checkLoggedIn, postCtrl.writePost);


//로그인햇는지 체크만함
const post = new Router();


//포스트컨트롤 아이디체크한다음에 , 이다음 컨트롤읽어주라
post.get('/', postCtrl.readPost); // 데이터 일부분(id)
post.delete('/', checkLoggedIn, checkOwnPost, postCtrl.deletePost);
//put 은 c로말하면 replace 바꾼그것만 바껴버리는거 한개바꾸고싶어도 나머지 다 적어야함
// posts.put("/:id", postCtrl.updatePost);          //업데이트
//patch 는 해당 항목만 바꾸면 다른건 그대로 있고 해당만 바뀌는거
post.patch('/', checkLoggedIn, checkOwnPost, postCtrl.updatePost); //업데이트 동사(목적어)
//밑에 id필요하면 id체크한후에 와서 로그인체크 자기글인지체크까지해야함

//"/:id" 가포함되면(필요하면)
// 전부 포트스컨트롤.체크아이디 해서 그다음 routes 컨트롤해주세요
// "이게있따면", 전부 옆에 미들웨어 실행하고 , 포스트라우터를 실행해주세요
//use가 미들웨어
posts.use('/:id', getPostById, post.routes());

//export edfault 임
module.exports = posts;
