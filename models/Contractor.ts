import mongoose from 'mongoose';

const ContractorSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  deelId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  country: { type: String },
  job_title: { type: String },
  tags: [{ type: String }],
});

ContractorSchema.index({ organizationId: 1, deelId: 1 }, { unique: true });

export default mongoose.models.Contractor || mongoose.model('Contractor', ContractorSchema);
