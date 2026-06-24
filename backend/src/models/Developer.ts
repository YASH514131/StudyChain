import mongoose, { Schema, Document } from 'mongoose';

export interface IDeveloper extends Document {
  walletAddress: string;
  nasScore: number;
  tier: string;
  createdAt: Date;
}

const DeveloperSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, unique: true, index: true, trim: true },
  nasScore: { type: Number, default: 0 },
  tier: { type: String, default: 'Initiate' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDeveloper>('Developer', DeveloperSchema);
