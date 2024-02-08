import { Schema, model, models, Document } from "mongoose";

export interface IChannel extends Document {
  name: string;
  type: string;
  serverId: Schema.Types.ObjectId;
  profileId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const ChannelSchema = new Schema({
  name: String,
  type: String,
  serverId: { type: Schema.Types.ObjectId, ref: "Server" },
  profileId: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null, index: true },
});
const Channel = models.Channel || model<IChannel>("Channel", ChannelSchema);

export default Channel;
