import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  walletAddress: string;
  challengeId: number;
  deployedProgramId: string;
  status: 'active' | 'failed' | 'passed';
  createdAt: Date;
}

const SessionSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, index: true },
  challengeId: { type: Number, required: true },
  deployedProgramId: { type: String, required: true },
  status: { type: String, enum: ['active', 'failed', 'passed'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISession>('Session', SessionSchema);
