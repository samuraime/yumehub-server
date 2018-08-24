const querystring = require('querystring');
const fetch = require('isomorphic-fetch');

let cachedToken = null;

const token = async (ctx) => {
  // 一个月过期，先写死
  if (cachedToken) {
    ctx.body = { token: cachedToken };
    return;
  }

  const params = {
    client_id: 'WnWHmK4G7NsIVce5kQNDVPxP',
    client_secret: 'KyxSEguh7wmw42mWwoE7nz62AOx2NaFc',
    grant_type: 'client_credentials',
  };

  // @see http://ai.baidu.com/docs#/Auth/top
  const response = await fetch(`https://aip.baidubce.com/oauth/2.0/token?${querystring.stringify(params)}`);
  const res = await response.json();
  if (res.error) {
    throw new Error(`WechatAPI: ${res.error} ${res.error_description}`);
  }
  // { access_token, expires_in, refresh_token }

  cachedToken = res.access_token;

  ctx.body = { token: res.access_token };
};

module.exports = {
  token,
};
