import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  image: String,
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  emailVerified: Date,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
