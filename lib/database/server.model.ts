import { Schema, model, models, Document } from "mongoose";

export interface IServer extends Document {
  name: string;
  imgUrl: string;
  inviteCode: string;
  members: Schema.Types.ObjectId[];
  channels: Schema.Types.ObjectId[];
  profileId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const ServerSchema = new Schema({
  name: String,
  imgUrl: String,
  members: [{ type: Schema.Types.ObjectId, ref: "MemberRole" }],
  channels: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
  inviteCode: {type: String, unique: true, },
  profileId: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null, index: true },
});
const Server = models.Server || model<IServer>("Server", ServerSchema);

export default Server;
