import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  name: { type: String, required: true },
  color: { type: String, default: '#e2e8f0' },
});

TagSchema.index({ organizationId: 1, name: 1 }, { unique: true });

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema);
