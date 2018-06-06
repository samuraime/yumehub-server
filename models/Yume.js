const mongoose = require('mongoose');

const { Schema } = mongoose;

const Yume = new Schema({
  text: { type: String, default: '' },
  images: [String],
  tags: [String],
  stars: { type: Number, default: 0 },
  thumbups: { type: Number, default: 0 },
  thumbuppers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dreamer: { type: Schema.Types.ObjectId, ref: 'User' },
  location: {
    name: String,
    longitude: Number,
    latitude: Number,
  },
  public: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

Yume.statics = {
  list(options = {}) {
    const { page = 0, perPage = 10, ...criteria } = options;
    return this.find(criteria)
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(perPage * page)
      .populate('dreamer')
      .exec();
  },
};

module.exports = mongoose.model('Yume', Yume);
