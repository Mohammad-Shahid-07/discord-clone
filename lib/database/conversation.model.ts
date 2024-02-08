import { Schema, model, models, Document } from "mongoose";

export interface IConversation extends Document {
  memberOne: Schema.Types.ObjectId;
  memberTwo: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const ConversationSchema = new Schema({
  memberOne: { type: Schema.Types.ObjectId, ref: "MemberRole" },
  memberTwo: { type: Schema.Types.ObjectId, ref: "MemberRole" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null, index: true },
});
const Conversation =
  models.Conversation ||
  model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
