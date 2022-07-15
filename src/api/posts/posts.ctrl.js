
const Post = require("../../models/post");

//오브젝트아이디는  "_언더바가함께하는 id"
const Joi = require("joi");
const {validateInput} = require("../../lib/validateInput");
const { removeHTML } = require("../../lib/util");
// const AutoIncrementFactory = require('mongoose-sequence');
// const { default: mongoose } = require("mongoose");
// const AutoIncrement = AutoIncrementFactory(mongoose);
// Schema.plugin(AutoIncrement,Post)
//디폴트면 노 {}
// const {ObjectId} = mongoose.Types;

// exports.getPostById = (ctx, next) =>{
//     const {id} = ctx.params;

//         //오브젝트아이디의 값이 유효합니까 있습니까 의 ! 반대
//         //이 아이디값을 비교해서 400을 해주면 배드리퀘스트 간단한 오류지만
//         //이게 없다면 500오류로 조금 심각한에렁미
//     if(!ObjectId.isValid(id)){
//         ctx.status= 400; //Bad Request.
//         ctx.body={
//             message: "ObjectId is not available.", //설명 
//         };
//         return;
//         // ctx.body ={
//         //     message: "ID가 오브젝트가아닙니다", //프론트에서 이해하기쉽게 메세지도 표현해준거
//         //     code: "E-12030이런식"  //이렇게 코드로도 표현
//         // }
//     }

//     try{
//         const post = Post.findById(id)
//         if(!post){
//             ctx.status =404;
//             return next();
//         }
//         ctx.state.post = post;
//         return next();
//     }catch(error){
//         ctx.throw(500, error);
//     }



//     return next();
// };
// let postId = 1;
// 여기서 선언한 아이디를 가져가서 +1 이런거하면안됨
// 데이터에서 가져온 아이디값을 가져와서 +1 시키는 작업을해야함



// const postsArr = [
//     {
//         id: Date.now(),
//         title: "title",
//         body: "body"
//     }
// ]

//일단 해야할것을 전체틀을잡고 익스포트하고 임포트하러 다른페이지감
exports.readAllPosts =async (ctx)=>{
                                        //십진법
    const page = parseInt(ctx.query.page || "1", 10);

    if(page < 1 ){
        ctx.status = 400;
        return;
    }

    //url에서 적을 키워드임 request 받을 명
    const {tag,username} =ctx.query;
    console.log(page,tag,username);
    //쿼리받은 요청받은친구만 표현하게해주는거 나름필터링
    const query =
                    //{오브젝트로유저.유저네임에 입력받은값넣는거}
                    //  username은 user속에있어서 처리해줘야함 ""도싸줘야함
    {...(username? {"user.username" : username} : {}),
    ...(tag? {tags:tag}:{}),
    };

    // console.log(query);

    try{
        //sort 순서정리하는거 윗순 아래순 desc() 반대는기본인데뭐더라  //limit 제한하는거
        const posts =  await Post.find(query)
            .sort({ _id: -1})           //lean() 은 밑에 tojson화하기싫으면 하면됨
            .limit(10).skip((page -1)*10).lean().exec(); 
            //모델에서찾아서(find).실행한다(exec)
        
        const postCount = await Post.countDocuments().exec();

        ctx.set("Last-Page", Math.ceil(postCount/10)) //Custsom Response Header

                                    //post.toJSON().map 제이슨대신에 위에 lean()으로 제이슨화
        ctx.body = posts.map((post) => ({
            ...post,
            body: post.body.length <200 ? post.body : `${post.body.slice(0,150)}...more.`
        }));
        
    }catch(error){
        ctx.throw(500, error);
    };

}


exports.writePost =async (ctx)=>{

    const schema = Joi.object().keys({
        // nuber: Joi.string(),
        title: Joi.string().required(),  //required 무조건잇어야한다.
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()), //arrya 안에는string이다
    });
    //검사결가과 나옴 string이들어가야하는데 array가들어갓다던지



    validateInput(schema,ctx);
    // const result = schema.validate(ctx.request.body);
    // if(result.error){
    //     ctx.status = 400;
    //     ctx.body = result.error.details[0].message; //메세지가 detailes배열안에들어잇음
    //     return;
    // }




    //request 요청 postman에 적어놧음 title,body
    const {title, body, tags} = ctx.request.body;
    
    // if(typeof title !== "string"){
    //     ctx.status = 400;        //위에 꺼랑 같은거
    //     ctx.body ="title이 string이 아닙니다";
    //     return;
    // }

    //  if(typeof title !== "string"){
    //      ctx.status = 400;
    //      return;
    //  }


                        //새로운거를 받아서 밑에  새롭게 입력하여데이터보존
    const post = new Post({ //몽고디비 post 접속
        // postNumber: AutoIncrement,
        title,
        body: removeHTML(body),  //util.js 에서 만든 거
        tags,   //이름이 일치하니까 생략가능
        user: ctx.state.user,
    });

    try{
        await post.save();  //데이터베이스에 저장 에러날수도잇으니 try catch
        ctx.body=post;  //등록하고 초기화 //

    }catch(error){
        ctx.throw(500,error); //이터...?에러
    };

    // const newPost = {id: Date.now(), title, body}
    // posts.push(newPost);
    
}


exports.readPost =async (ctx)=>{

    ctx.body = ctx.state.post;
    //밑에  친구들은 인덱스 컨트롤러에서 하기떄문에 생략가능
    //id가 필요함
    // const{ id } = ctx.params; //너 값 어디서가져오니??
    // //params.id !== post.id 아이디가 하나가아닐때오류날수도
    // // params.id 가 언디파인이거나 두개자료형 타입이 다를때 오류날수도
    // // console.log(id);
        
    //     //파라메터부터받아온id    
    // const post  = await Post.findById(id).exec();
    
    // try{
    //     if(!post){
    //         ctx.status = 404; //
    //         ctx.body = {
    //             message: "post가 존재하지않습니다"
    //         };
    //         return; //처리종료
    //     }
    //     //////처리다하고 값 넣음
    //     ctx.body = post;  //찾앗으면 그대로 바디에 넣음
    // }catch(error){
    //     ctx.throw(500, error);
    // };  


        //여기id는 젤위에 오브젝트의 id임 === 위에 const id
        //그래서 post 한개 찾아서 넣음
    //{가있으면}return을해야함 그래서 출력이안되고잇엇음 복수줄일때만함
    // 날{가없으면} 1행으로 끝꺼같으면 없이 return없이 출력 {}유무차이조심
    //post.id는 숫자  받아온params는 스트링이나까 맞춰준거
    //직직접원인 post를 찾지 못하거나 존재하지않으면 오류
    //간접적원인 find의 인수에있는 함수에서 문법적 오류
    // const post = postsArr.find((post)=>
    //     post.id.toString()===id
    // );

    //////여기까지고 하고싶은작업을 하고 이밑에는 예외처리하고 

    //예상할수없는 error =>  bug, unexpected exception, 시스템에러 
    //error => business logic(error)

    //post == undefined, null 일때  여기까지온거임 


}



//post.remove  는 어떻게 삭제할지 종류가많음
exports.deletePost =(ctx)=>{
    const { id } = ctx.params;
    
    try{
        Post.findByIdAndRemove(id).exec();
        ctx.status = 204;
    }catch(error){
        ctx.throw(500, error);
    }

    //없는경우 -1 되버림 index이니까
    // const index = postsArr.findIndex((post)=> post.id.toString()===id);



    // if(index === -1){
    //     ctx.status = 404;
    //     ctx.body = {
    //         message: "post가 존재하지않습니다"
    //     };
    //     return;
    // }
    //             //splice는 뒤로 몇개를 지울껀지 2개면 해당글과뒷글 같이 삭제
    //             postsArr.splice(index, 1);

    // //성공했지만 보여지는 내용이 없어요라는 오류
    // ctx.status=204;
}



exports.updatePost =async (ctx)=>{
    const { id } = ctx.params;

    const schema = Joi.object().keys({
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string()), //arrya 안에는string이다
    });
    //검사결가과 나옴 string이들어가야하는데 array가들어갓다던지
    const result = schema.validate(ctx.request.body);
    


    if(result.error){
        ctx.status = 400;
        ctx.body = result.error.details[0].message; //메세지가 detailes배열안에들어잇음
        return;
    }

    const nextData = { ...ctx.request.body };

    if (nextData.body) {
      nextData.body = removeHTML(nextData.body);
    }
    
    try{
                                //업데이트는 새로수정할 바디가 필요하니까같이넣음
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, 
            {
            new:true   //트루는 업데이트후 데이터 넣기 폴스는 업데이트 전에 데이터 넣기
            },
            ).exec();
                        //모도리치가 퀘리임   
            if(!post){
                ctx.status = 404;
                ctx.body = {
                    message: "post가 존재하지않습니다"
                };
                return;
            }
            ctx.body = post;
    }catch(error){
        ctx.throw(500,error);
    }

                    //없는경우 -1 되버림 index이니까
    // const index = postsArr.findIndex((post)=> post.id.toString()===id);

    // if(!post){
    //     ctx.status = 404;
    //     ctx.body = {
    //         message: "post가 존재하지않습니다"
    //     };
    //     return;
    // }

    // postsArr[index] ={
    //     ...postsArr[index],
    //     ...ctx.request.body, //사용자가 요청한 내용전부를 하나씩 풀어줭
    //     //title : title : 새로운내용 //이렇게되서 뒷내용생략가능..
    //     //하지만 다른 글씨면 다 새롭게 추가됨.
    // };

    // ctx.body= postsArr;

}





//index 포스트에잇던 이글을 여기서 익스포트해서 똑같이 사용가능
// exports.printInfo = ctx =>{
//     ctx.body = {
//         method: ctx.method,
//         path: ctx.path,
//         params: ctx.params,
//     };
// };
