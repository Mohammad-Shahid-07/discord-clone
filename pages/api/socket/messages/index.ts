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

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePages(req);
    const { message, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    if (!serverId || !channelId) {
      return res
        .status(400)
        .json({ message: "serverId and channelId are required" });
    }
    connectToDatabase();
    const server = await Server.findById({ _id: serverId }).populate("members");

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const member = server.members.find(
      (member: IMemberRole) =>
        member.profileId.toString() === profile._id.toString(),
    );

    if (!member) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const channel = await Channel.findById({
      _id: channelId,
      server: serverId,
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const messageData = {
      memberId: member._id,
      channelId: channel._id,
      serverId,
      content: message,
      fileUrl: fileUrl || null,
    };

    const newMessage = await Message.create(messageData);
    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, newMessage);
    return res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
