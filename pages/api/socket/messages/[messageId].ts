import { currentProfilePages } from "@/lib/actions/user.action";
import Channel from "@/lib/database/channel.model";
import { IMemberRole } from "@/lib/database/memberRole.model";
import Message from "@/lib/database/message.model";
import Server from "@/lib/database/server.model";
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
    const { messageId, channelId, serverId } = req.query;
    const { content } = req.body;
    console.log(content);

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!messageId) {
      return res.status(400).json({ message: "MessageId is required" });
    }
    if (!serverId || !channelId) {
      return res
        .status(400)
        .json({ message: "serverId and channelId are required" });
    }
    connectToDatabase();

    const server = await Server.findOne({ _id: serverId }).populate("members");

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel = await Channel.findOne({
      _id: channelId,
      server: serverId,
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const member = server.members.find(
      (member: IMemberRole) =>
        member.profileId.toString() === profile._id.toString(),
    );

    if (!member) {
      return res.status(403).json({ message: "Forbidden" });
    }
    let message = await Message.findOne({
      _id: messageId,
      channel: channelId,
    }).populate("memberId");
    if (!message || message.deleted) {
      return res.status(404).json({ message: "Message not found" });
    }
    console.log( message);
    
    const isMessageOwner = message.memberId._id.toString() === member._id.toString() ;
    const isAdmin = member.role === "ADMIN";
    const isModarator = member.role === "MODERATOR";
    const canModify = isAdmin || isModarator || isMessageOwner;
   
    if (!canModify) {
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
    console.log({ message });

    const updateKey = `chat:${channelId}:message:update`;
    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
