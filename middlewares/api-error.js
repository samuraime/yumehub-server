const logger = require('../utils/logger');

const handle = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    logger.error('API', {
      URL: ctx.url,
      Method: ctx.method,
      Headers: ctx.headers,
      Body: ctx.request.body,
      'Error Message': e.message,
      'Error Stack': e.stack,
    });
    ctx.body = {
      code: e.code || 500,
      // TODO: hide message for production
      message: e.message || 'game over',
    };
  }
};

module.exports = handle;
