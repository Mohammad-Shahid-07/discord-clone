"use server";
import { currentProfile } from "@/lib/actions/user.action";
import Message, { IMessage } from "@/lib/database/message.model";
import { connectToDatabase } from "@/lib/mongoose";

export async function getMessages(channelId: string) {
  try {
    connectToDatabase();

    const profile = await currentProfile();
    const MESSAGES_BATCH = 10;
 
    if (!profile) {
      return;
    }
    if (!channelId) {
      return;
    }

    let messages: any[] = [];
    // if (pageParams) {
    //   messages = await Message.find({
    //     channelId,
    //   })
    //     .populate("memberId")
    //     .sort({ createdAt: -1 })
    //     .limit(10);
    // } else {
    // }
    messages = await Message.find({ channelId })
      .sort({ createdAt: -1 })
      .limit(10);

    let NextCursor = null;
    if (messages.length === 10) {
      NextCursor = messages[9]._id;
    }
    return { messages, NextCursor };
  } catch (error) {
    console.log(error);
  }
}
