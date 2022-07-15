const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwd = require('jsonwebtoken');

const { Schema } = mongoose;
//자동으로만들어준다?
const UserSchema = new Schema({
  username: String,
  hashedPassword: String, //암호는 암호회 해쉬화 함
  phone: String,
  email: String,
  description: String,
  address: String,
  joinedDate: {
    type: Date,
    default: Date.now(),
    // 스트링디폴트도 정할수잇음 default:"",정도
  },
});
//여기에 사용하고싶은 이름 적는거임
UserSchema.methods.setPassword = async function (password) {
  //bcrypt는 인스턴스,hash할 데이터넣기 프로미스로해야해서 async await추가해야함
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
  //익명함수로 (password) =>{this}하면 {}안에값this이고 펑션으로하면 페이지 내의 this임
};

UserSchema.methods.checkPassword = async function (password) {
  //값비교해서 true false 출력
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

UserSchema.methods.serialized = function () {
  const data = this.toJSON(); //user 가아니라 현재페이지 값을 바꿔야하니까 this.
  delete data.hashedPassword; //비밀번호는 삭제 안보이게
  delete data._id;
  return data;
};

UserSchema.methods.generateToken = function () {
  //payload 토큰에 넣고싶은정보
  const token = jwd.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.JWT_SECRET,
    {
      //언제 만료될지정하기
      expiresIn: '1d', //1주일7d  //1일 1d
    },
  );
  return token;
};

UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

//(설정하는이름,스키마)
const User = mongoose.model('User', UserSchema);
//User 라는 친구는 UserSchema 라는 친구를가지고잇다 다른곳에서 쓰이게
module.exports = User;
