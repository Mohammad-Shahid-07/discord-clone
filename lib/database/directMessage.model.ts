import { Schema, model, models, Document } from "mongoose";

export interface IDirectMessage extends Document {
  _id: Schema.Types.ObjectId;
  content: string;
  fileUrl?: string;
  memberId: Schema.Types.ObjectId;
  conversationId: Schema.Types.ObjectId;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const DirectMessageSchema = new Schema({
  content: { type: String, required: true },
  fileUrl: { type: String, default: null },
  memberId: { type: Schema.Types.ObjectId, ref: "MemberRole", required: true },
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null, index: true },
});
const DirectMessage =
  models.DirectMessage ||
  model<IDirectMessage>("DirectMessage", DirectMessageSchema);

export default DirectMessage;
