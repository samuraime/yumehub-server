/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_doc"] }] */

const mongoose = require('mongoose');
const Yume = require('../models/Yume');
const User = require('../models/User');

const list = async (ctx) => {
  const { page, perPage } = ctx.query;
  const [yumes, user] = await Promise.all([
    Yume.list({ page: +page - 1, perPage: +perPage, public: true }),
    User.findById(ctx.state.user.id, { stars: true }),
  ]);
  ctx.body = yumes.map(yume => ({
    ...yume._doc,
    starred: user.stars.includes(yume._id),
    thumbupped: yume.thumbuppers.includes(ctx.state.user.id),
  }));
};

const create = async (ctx) => {
  // TODO validate
  const yume = await Yume.create({
    ...ctx.request.body,
    dreamer: ctx.state.user.id,
  });
  await User.findByIdAndUpdate(ctx.state.user.id, {
    $push: {
      posts: yume._id,
    },
  });
  ctx.body = yume;
};

const posts = async (ctx) => {
  // const { page, perPage } = ctx.query;
  const { posts: yumes } = await User.findById(ctx.state.user.id, { posts: true })
    .populate({
      path: 'posts',
      populate: {
        path: 'dreamer',
      },
    })
    .exec();
  ctx.body = yumes.map(yume => ({
    ...yume._doc,
    starred: true,
    thumbupped: yume.thumbuppers.includes(ctx.state.user.id),
  }));
};

const starred = async (ctx) => {
  // const { page, perPage } = ctx.query;
  const { stars: yumes } = await User.findById(ctx.state.user.id, { stars: true })
    .populate({
      path: 'stars',
      populate: {
        path: 'dreamer',
      },
    })
    .exec();
  ctx.body = yumes.map(yume => ({
    ...yume._doc,
    starred: true,
    thumbupped: yume.thumbuppers.includes(ctx.state.user.id),
  }));
};

const star = async (ctx) => {
  const { id } = ctx.params;
  const [yume] = await Promise.all([
    Yume.findByIdAndUpdate(id, {
      $inc: {
        stars: 1,
      },
    }, {
      new: true,
      select: {
        stars: true,
      },
    }),
    User.findByIdAndUpdate(ctx.state.user.id, {
      $addToSet: {
        stars: mongoose.Types.ObjectId(id),
      },
    }),
  ]);
  ctx.body = {
    stars: yume.stars,
    starred: true,
  };
};

const unstar = async (ctx) => {
  const { id } = ctx.params;
  const [yume] = await Promise.all([
    Yume.findByIdAndUpdate(id, {
      $inc: {
        stars: -1,
      },
    }, {
      new: true,
      select: {
        stars: true,
      },
    }),
    User.findByIdAndUpdate(ctx.state.user.id, {
      $pull: {
        stars: mongoose.Types.ObjectId(id),
      },
    }),
  ]);
  ctx.body = {
    stars: yume.stars,
    starred: false,
  };
};

const thumbup = async (ctx) => {
  const { id } = ctx.params;
  const yume = await Yume.findByIdAndUpdate(id, {
    $inc: {
      thumbups: 1,
    },
  }, {
    new: true,
    select: {
      thumbups: true,
    },
  });
  ctx.body = {
    thumbups: yume.thumbups,
    thumbupped: true,
  };
};

const unthumbup = async (ctx) => {
  const { id } = ctx.params;
  const yume = await Yume.findByIdAndUpdate(id, {
    $inc: {
      thumbups: -1,
    },
  }, {
    new: true,
    select: {
      thumbups: true,
    },
  });
  ctx.body = {
    thumbups: yume.thumbups,
    thumbupped: false,
  };
};

module.exports = {
  list,
  create,
  posts,
  starred,
  star,
  unstar,
  thumbup,
  unthumbup,
};
