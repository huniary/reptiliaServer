const User = require('../../models/user');

exports.getUserInfo = async (ctx) => {
  const { id } = ctx.params;

  try {
    const user = await User.findById(id).exec();
    if (!user) {
      //   console.log('유저없어요');
      ctx.status = 404;
      ctx.body = { message: '해당아이디친구없어용' };
      return;
    }

    ctx.body = user;
  } catch (error) {
    console.log(error);
  }
};
