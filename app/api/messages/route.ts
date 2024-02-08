import { currentProfile } from "@/lib/actions/user.action";
import Message, { IMessage } from "@/lib/database/message.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    connectToDatabase();

    const profile = await currentProfile();
    const MESSAGES_BATCH = 10;

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return;
    }
    if (!channelId) {
      return;
    }

    let messages: any[] = [];
    if (cursor) {
      messages = await Message.find({
        channelId,
        _id: { $lt: cursor },
      })
        .populate({
          path: "memberId",
        })
        .sort({ createdAt: -1 })
        .limit(10);
    } else {
      messages = await Message.find({ channelId })
        .populate({
          path: "memberId",
        })
        .sort({ createdAt: -1 })
        .limit(10);
    }

    let NextCursor = null;
    if (messages.length === 10) {
      NextCursor = messages[9]._id;
    }

    return new NextResponse(JSON.stringify({ messages, NextCursor }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
