// const { string } = require("joi");
const mongoose = require("mongoose");
// const AutoIncrementFactory = require('mongoose-sequence');
// const AutoIncrement = AutoIncrementFactory(mongoose);


const {Schema} = mongoose;

//자동으로만들어준다?
const PostSchema = new Schema({
    // postNumber: Number,
    title: String,  //타이틀은 스트링이다
    body: String,  //이런곳에도 { type:   default:}다가능
    tags: [String], //배열이지만 스트링배열이다.몽고디비 가능
    publishedDate: {
        type: Date,
        default: Date.now,  //몽고디비는 자동으로    
    },
    user:{
        _id: mongoose.Types.ObjectId,
        username: String,
    },

});
            //(설정하는이름,스키마)
const Post  = mongoose.model("Post",PostSchema );
//Post 라는 친구는 PostSchema 라는 친구를가지고잇다 다른곳에서 쓰이게
module.exports = Post;