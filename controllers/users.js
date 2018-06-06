/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */

const querystring = require('querystring');
const fetch = require('isomorphic-fetch');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

const login = async (ctx) => {
  const { code } = ctx.request.body;
  const params = {
    appid: config.appId,
    secret: config.appSecret,
    js_code: code,
    grant_type: 'authorization_code',
  };
  // @see https://developers.weixin.qq.com/miniprogram/dev/api/open.html#wxgetuserinfoobject
  const response = await fetch(`https://api.weixin.qq.com/sns/jscode2session?${querystring.stringify(params)}`);
  const res = await response.json();
  if (res.errcode) {
    throw new Error(`WechatAPI: ${res.errcode} ${res.errmsg}`);
  }
  // { session_key, expires_in, openid }
  let user = await User.findOne({ openid: res.openid });
  if (!user) {
    user = await User.create({ openid: res.openid });
  }
  const token = jwt.sign({
    id: user._id,
  }, config.jwtSecret, {
    expiresIn: 86400 * 30,
  });
  ctx.body = { token };
};

const find = async (ctx) => {
  const user = await User.findById(ctx.state.user.id);
  ctx.body = user;
};

const update = async (ctx) => {
  const user = await User.findByIdAndUpdate(ctx.state.user.id, ctx.request.body, {
    new: true,
  });
  ctx.body = user;
};

const getStars = async (ctx) => {
  const { yumes } = await User.findById(ctx.state.user.id, { yumes: true }).populate('yumes');
  ctx.body = yumes;
};

module.exports = {
  login,
  find,
  update,
  getStars,
};
