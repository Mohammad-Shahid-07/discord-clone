import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  image?: string;
  servers: Schema.Types.ObjectId[];
  members: Schema.Types.ObjectId[];
  channels: Schema.Types.ObjectId[];
  updatedAt: Date;
  joinedAt: Date;
}
const UserSchema = new Schema({
  clerkId: { type: String, unique: true, required: true },
  name: String,
  email: { type: String, unique: true, required: true },
  image: String,
  servers: [{ type: Schema.Types.ObjectId, ref: "Server" }],
  members: [{ type: Schema.Types.ObjectId, ref: "MemberRole" }],
  channels: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
  updatedAt: { type: Date, default: null, index: true },
  joinedAt: { type: Date, default: Date.now },
});
const User = models.User || model<IUser>("User", UserSchema);

export default User;
