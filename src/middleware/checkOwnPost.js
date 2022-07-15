const checkOwnPost = (ctx, next) =>{
    const {user,post} =  ctx.state;
    console.log(post.user._id.toString(),user._id);
                //여긴옵젝아이디   // 여긴 스트링아이디

    //자기가아닌경우는  오류 403;

    if (post.user._id.toString() !== user._id) {
        
        ctx.status =403;
        return next();
      }

      
      return next();
}
      module.exports = checkOwnPost;