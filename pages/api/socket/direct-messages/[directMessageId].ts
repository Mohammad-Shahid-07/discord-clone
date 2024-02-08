import { currentProfilePages } from "@/lib/actions/user.action";
import Conversation from "@/lib/database/conversation.model";
import DirectMessage from "@/lib/database/directMessage.model";

import { connectToDatabase } from "@/lib/mongoose";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePages(req);
    const {  directMessageId, conversationId } = req.query;
    const { content } = req.body;
    
    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!directMessageId) {
      return res.status(400).json({ message: "MessageId is required" });
    }
    if (!conversationId) {
      return res.status(400).json({ message: "conversationId are required" });
    }
    connectToDatabase();

    const conversation = await Conversation.findOne({
      _id: conversationId,
    }).populate("memberOne memberTwo");

    if (!conversation) {
      return res.status(404).json({ message: "Server not found" });
    }

    const member =
      conversation.memberOne.profileId.toString() === profile._id.toString()
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(403).json({ message: "Forbidden" });
    }

    let message = await DirectMessage.findOne({
      conversationId: conversationId,
      memberId: member._id.toString(),
    }).populate("memberId");
   
    
    if (!message || message.deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isMessageOwner =
      message.memberId._id.toString() === member._id.toString();


    if (!isMessageOwner) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.method === "DELETE") {
      message.deleted = true;
      message.fileUrl = null;
      message.content = "This message has been deleted";
      message = await message.save();
    }
    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (req.body.content) {
        message.content = req.body.content;
      }
      message = await message.save();
    }
   

    const updateKey = `chat:${conversation._id}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
