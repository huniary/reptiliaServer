const mongoose = require("mongoose");

const {Schema} = mongoose;

const ReplySchema = new Schema({
    content: String,
    postId: mongoose.Types.ObjectId,
    title: String,
    publishedDate: {
        type: Date,
        default: Date.now,
    },
    user:{
        _id: mongoose.Types.ObjectId,
        username: String,
    },
});
        //3번째 변수는 몽고디비에서 파일네임
const Reply = mongoose.model("Reply", ReplySchema,"reply" );

module.exports = Reply;