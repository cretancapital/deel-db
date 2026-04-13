import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Organization || mongoose.model('Organization', OrganizationSchema);
