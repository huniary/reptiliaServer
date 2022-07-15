const Reply = require('../../models/reply');

const Joi = require('joi');
const { validateInput } = require('../../lib/validateInput');
const { removeHTML } = require('../../lib/util');

exports.readAllReply = async (ctx) => {
  console.log(ctx.params);
  const { id } = ctx.params;

  try {
    const reply = await Reply.find({ postId: id }).lean().exec();

    if (!reply) {
      ctx.state = 204;

      return;
    }

    ctx.body = reply;
  } catch (error) {
    ctx.throw(500, error);
  }
};

exports.writeReply = async (ctx) => {
  const schema = Joi.object().keys({
    content: Joi.string().required(),
    postId: Joi.string(),
    title: Joi.string(),
  });

  validateInput(schema, ctx);
  //,body
  const { _id, title, content } = ctx.request.body;

  // console.log(`${_id}${title}${content}리플라컨트롤러`);
  // console.log(`${ctx.request.body}시티엑리퀘스트바디`);
  // console.log(ctx.state);
  // console.log(ctx);
  // console.log(`${ctx.state}시티엑스테이트`);
  // console.log(`${ctx.state.user}시티엑스테이트`);

  const reply = new Reply({
    // body : removeHTML(body),
    content,
    postId: _id,
    title,
    user: ctx.state.user,
  });

  try {
    await reply.save();
    ctx.body = reply;
  } catch (error) {
    ctx.throw(500, error);
  }
};

exports.deleteReply = async (ctx) => {
  const { id } = ctx.params;
  console.log(id);

  try {
    Reply.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (error) {
    ctx.throw(500, error);
  }
};

exports.updateReply = async (ctx) => {
  const { id } = ctx.params;
  // 값오는지확인해보기.
  const schema = Joi.object().keys({
    content: Joi.string().required(),
    postId: Joi.string(),
    title: Joi.string(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const nextData = { ...ctx.request.body };

  console.log(nextData, 'nextData입니다.');

  if (nextData.body) {
    nextData.body = removeHTML(nextData.body);
  }

  try {
    const reply = await Reply.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
    if (!reply) {
      ctx.status = 404;
      ctx.body = {
        message: 'reply가 존재하지않습니다.',
      };
      return;
    }
    ctx.body = reply;
  } catch (error) {
    ctx.throw(500, error);
  }
};
