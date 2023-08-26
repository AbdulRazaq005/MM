import mongoose from 'mongoose';

const detailSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
    },
  }
);

const Detail = mongoose.model('Detail', detailSchema);

export default Detail;

