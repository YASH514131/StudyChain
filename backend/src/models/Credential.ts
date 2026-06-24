import mongoose, { Schema, Document } from 'mongoose';

export interface ICredential extends Document {
  recipientWallet: string;
  challengeId: number;
  title: string;
  level: string;
  points: number;
  issuingOrganization: string;
  mintAddress: string;
  transactionSignature: string;
  issuedAt: Date;
}

const CredentialSchema: Schema = new Schema({
  recipientWallet: { type: String, required: true, index: true },
  challengeId: { type: Number, required: true },
  title: { type: String, required: true },
  level: { type: String, required: true },
  points: { type: Number, required: true },
  issuingOrganization: { type: String, required: true },
  mintAddress: { type: String, required: true },
  transactionSignature: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICredential>('Credential', CredentialSchema);
