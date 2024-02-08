import { currentProfilePages } from "@/lib/actions/user.action";
import Channel from "@/lib/database/channel.model";
import Conversation from "@/lib/database/conversation.model";
import DirectMessage from "@/lib/database/directMessage.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextApiResponseServerIo } from "@/types";

import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePages(req);
    const { message, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" });
    }
    connectToDatabase();
    const conversation = await Conversation.findOne({
      _id: conversationId,
    }).populate("memberOne memberTwo");

    if (!conversationId) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    const member =
      conversation.memberOne.profileId.toString() === profile._id.toString()
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const messageData = {
      memberId: member._id,
      conversationId: conversationId,
      content: message,
      fileUrl: fileUrl || null,
    };

    const newMessage = await DirectMessage.create(messageData);
    const channelKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, newMessage);
    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
