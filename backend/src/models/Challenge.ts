import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
  id: number;
  title: string;
  level: string;
  difficulty: string;
  description: string;
  vulnerability: string;
  points: number;
  fullProblem: string;
  hints: string[];
  template: string;
}

const ChallengeSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  level: { type: String, required: true },
  difficulty: { type: String, required: true },
  description: { type: String, required: true },
  vulnerability: { type: String, required: true },
  points: { type: Number, required: true },
  fullProblem: { type: String, required: true },
  hints: [{ type: String }],
  template: { type: String, required: true }
});

export default mongoose.model<IChallenge>('Challenge', ChallengeSchema);
