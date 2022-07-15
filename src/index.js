require('dotenv').config(); //이거 제일 위에적어야됨

const Koa = require('koa'); // common js는 import, export 사용 안함
const koaBodyparser = require('koa-bodyparser');
const Router = require('koa-router');
const api = require('./api');
const mongoose = require('mongoose');
// const { createFakeData } = require("./createFakeData");
const jwtMiddleware = require('./middleware/jwtMiddleware');
const path = require('path');
const serve = require('koa-static');
const send = require('koa-send');
const cors = require('@koa/cors');

const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('디비접속완료');
    // createFakeData();
  })
  .catch((e) => {
    console.log(e);
  });

const app = new Koa();
const router = new Router();
//라우터 HTTP 메소드 사용가능 get post 등등
// router.get("/", (ctx)=>{
//     ctx.body = "Home";
// })
//api 있는 모든 route 사용하는거
router.use('/api', api.routes());

app.use(cors());

app.use(koaBodyparser());
app.use(jwtMiddleware);

router.get('/about', (ctx) => {
  ctx.body = 'About';
});

// router.get("/about/:name", (ctx)=> {
//     const {name} = ctx.params;

//     ctx.body = name ? `about${name}` : "About";
// })

// router.get("/post", (ctx)=> {
//     const {id} = ctx.query;

//     ctx.body = id ? `${id}번째 포스터` : "존재안해";
// })

//???너뭐니 그냥 모든걸 실행시키는거니
app.use(router.routes()).use(router.allowedMethods());

const dir = path.resolve(__dirname, '../albatross/build');
app.use(serve(dir));

app.use(async (ctx) => {
  if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
    await send(ctx, 'index.html', { root: dir });
  }
});

// 서버가 기동하면 이 에이치티엠엘을 보여주세요.

//      3000
//     proxy: 4000
// 사용자 <=> 서버
//       4000
//       cross-origin

// app.use(async (ctx,next)=>{
//     console.log(ctx.url);
//     console.log(1);
//     if(ctx.query.auth !== "1"){ //401 들어가면안된다?
//         ctx.status = 401;   //404 주소가잘못된거
//         return;
//     }
//     await next(); //이 next해서 다음으로다넘어간다음에밑으로넘어가는거임 그래서 제일 마지막
//     console.log("Call back!!!");//  에싱크ㅇㅓ웻이랑

//     //             .then(()=>{  next().then()친구랑같음
//     //     console.log("CallBack1!!!");
//     // }); //next가없으면 1에서 끝나버림
// });

// app.use((ctx,next)=>{
//     console.log(2);
//     next();
// });
// app.use((ctx)=>{
//     ctx.body ="hello";
// });

//.env 에서 설정한 이름
const port = PORT;
app.listen(port, () => {
  console.log(`${port} 에서 서버가쥰비됫씁니다.`);
});
