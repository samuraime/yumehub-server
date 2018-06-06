const mongoose = require('mongoose');

const { Schema } = mongoose;

// @see https://developers.weixin.qq.com/miniprogram/dev/api/open.html#wxgetuserinfoobject
const User = new Schema({
  openid: String,
  nickName: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  gender: { type: Number, default: 0 }, // 0：未知、1：男、2：女
  country: { type: String, default: '' },
  province: { type: String, default: '' },
  city: { type: String, default: '' },
  language: { type: String, default: '' },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Yume' }],
  stars: [{ type: Schema.Types.ObjectId, ref: 'Yume' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', User);
