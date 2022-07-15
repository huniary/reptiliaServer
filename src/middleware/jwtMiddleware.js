const jwt = require("jsonwebtoken");
const User = require("../models/user");

const jwtMiddleware = async (ctx, next) =>{
    //토큰 검증하기위해 일단 읽기 검색하기
    const token = ctx.cookies.get("access_token");
    if(!token) return next();
    try{
    //encode<=>decode //.토큰과 옆에 친구를 비교한다 /모델유저엣선 사인사용해봄
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //보통 회원정보관련은 사이트에잇는 토큰에서 나온거임 관리측에서 준거아님
        //가져온거 표시해주기 
        ctx.state.user ={
            _id: decoded._id,
            username: decoded.username,
        };
        //토큰만료일 - 지금 = 남은기간  지츠비(실일)  에교비(영업일) EOM() EOY 기말
        //년시작일이      한국은2월   일본은3월  iat  exp는 만ㅇ료일
        //토큰 확인한후에 2일도안남앗으면 늘리는거
        const now = Math.floor(Date.now() /1000);  //만료일보다 지금이적어야하니까 내림
        if(decoded.exp - now < 60*60*24*2){
            const user = await User.findById(decoded._id);
            const token = user.generateToken();
            ctx.cookies.set("access_token",token,{
                maxAge: 1000 * 60 * 60 *24 * 7,  //이게 1주일계산 7일 24일 시분초  
                httpOnly: true,
            } );

        }
        return next();
    } catch(error){
        return next();
    }
}

module.exports = jwtMiddleware;