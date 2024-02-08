import { Schema, model, models, Document } from "mongoose";

export interface IMessage extends Document {
  _id: Schema.Types.ObjectId;
  content: string;
  fileUrl?: string;
  memberId: Schema.Types.ObjectId;
  serverId: Schema.Types.ObjectId;
  channelId: Schema.Types.ObjectId;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const MessageSchema = new Schema({
  content: { type: String, required: true },
  fileUrl: { type: String, default: null },
  serverId: { type: Schema.Types.ObjectId, ref: "Server" },
  memberId: { type: Schema.Types.ObjectId, ref: "MemberRole", required: true },
  channelId: { type: Schema.Types.ObjectId, ref: "Channel" },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null, index: true },
});
const Message = models.Message || model<IMessage>("Message", MessageSchema);

export default Message;
