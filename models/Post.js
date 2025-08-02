import { Schema, model } from 'mongoose';
const PostSchema = new Schema({
  title:   { type: String, required: true },
  content: { type: String, required: true },
  author:  { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  createdAt: { type: Date, default: Date.now }
});
export default model('Post', PostSchema);
