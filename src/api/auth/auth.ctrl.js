const User = require('../../models/user');
const Joi = require('joi');
// const { validateInput } = require('../../lib/validateInput');

//회원등록

exports.register = async (ctx) => {
  const schema = Joi.object().keys({
    //request.body 애는 이형식으로 받아오기때문에 해쉬패스워드아님
    //무조건 알파벳만.최소글자.최대글자.email() 이친구는 이메일형식
    username: Joi.string().alphanum().min(4).max(15).required(), //required 무조건잇어야한다.
    password: Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.string(),
    address: Joi.string(),
  });
  // const validation = schema.validate({username});
  // console.log(validation.error.details);
  // if(validation.error) retrun ;

  const result = schema.validate(ctx.request.body);

  console.log(result);
  if (result.error) {
    ctx.status = 400;
    // console.log(result.error.details[0].path[0]);

    switch (result.error.details[0].path[0]) {
      case 'email':
        ctx.body = {
          //ctx.body에 결과값출력 바디에
          message: 'E-mail형식을 확인해주세요',
        };
        break;
      default:
        break;
    }
    return;
  }

  const { username, password, email = '', phone = '', address = '' } = ctx.request.body;

  try {
    //username check
    const exists = await User.findByUsername(username); //유저의 메소드가져옴
    if (exists) {
      ctx.status = 409; //conflict // 중복검사
      return;
    }
    //설계서에서만 static으로 정의하고
    //모델user에서 새로운 new User 만들어낸거/인스턴스?
    const user = new User({
      username,
      email,
      phone,
      address,
      description: '', //패스워드느 ㄴ암호화한후에 넣어야해서 안함
    });

    await user.setPassword(password); //User에 셋패스워드가져와서 거기서 해쉬패스워드저장
    await user.save(); //이미저장햇으니까

    ctx.body = user.serialized();

    const token = user.generateToken();
    //토큰이름정하기,token, 옵션
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //이게 1주일계산 7일 24일 시분초
      httpOnly: true,
    });
  } catch (error) {
    ctx.throw(500, error);
  }
};

// 로그인

exports.login = async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 401; //패스워드가없으면
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }

    const validPwd = await user.checkPassword(password);
    if (!validPwd) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialized();
    //로컬스트리지에 저장해줘야함 그래야 로그인한거니까

    const token = user.generateToken();
    //토큰이름정하기,token, 옵션
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //이게 1주일계산 7일 24일 시분초
      httpOnly: true,
    });
  } catch (error) {
    ctx.throw(500, error);
  }
};

//로그인중확인
exports.check = async (ctx) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    return;
  }
  ctx.body = user;
};

//로그아웃
exports.logout = async (ctx) => {
  ctx.cookies.set('access_token');
  ctx.status = 204;
};
