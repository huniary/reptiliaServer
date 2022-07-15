const mongoose = require("mongoose");
const Post = require("../models/post");

const {ObjectId} = mongoose.Types;

const getPostById = async (ctx, next) =>{
    const {id} = ctx.params;
console.log(id)
        //오브젝트아이디의 값이 유효합니까 있습니까 의 ! 반대
        //이 아이디값을 비교해서 400을 해주면 배드리퀘스트 간단한 오류지만
        //이게 없다면 500오류로 조금 심각한에렁미
    if(!ObjectId.isValid(id)){
        ctx.status= 400; //Bad Request.
        ctx.body={
            message: "ObjectId is not available.", //설명 
        };
        return;
        // ctx.body ={
        //     message: "ID가 오브젝트가아닙니다", //프론트에서 이해하기쉽게 메세지도 표현해준거
        //     code: "E-12030이런식"  //이렇게 코드로도 표현
        // }
    }

    try{
        const post =await Post.findById(id).exec();
        if(!post){
            ctx.status =404;
            return next();
        }
        ctx.state.post = post;
        return next();
    }catch(error){
        ctx.throw(500, error);
    }



    return next();
};

module.exports = getPostById;