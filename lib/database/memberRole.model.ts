import { Schema, model, models, Document } from "mongoose";

export interface IMemberRole extends Document {
  role: string;
  profileId: Schema.Types.ObjectId;
  serverId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const MemberRoleSchema = new Schema({
  role: { type: String, default: "GUEST" },
  serverId: { type: Schema.Types.ObjectId, ref: "Server" },
  profileId: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null, index: true },
});
const MemberRole =
  models.MemberRole || model<IMemberRole>("MemberRole", MemberRoleSchema);

export default MemberRole;
