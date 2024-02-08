import { currentProfile } from "@/lib/actions/user.action";
import DirectMessage, { IDirectMessage } from "@/lib/database/directMessage.model";
import { connectToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    connectToDatabase();

    const profile = await currentProfile();
    const MESSAGES_BATCH = 10;

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return;
    }
    if (!conversationId) {
      return;
    }

    let messages: any[] = [];
    if (cursor) {
      messages = await DirectMessage.find({
        conversationId,
        _id: { $lt: cursor },
      })
        .populate({
          path: "memberId",
        })
        .sort({ createdAt: -1 })
        .limit(10);
    } else {
      messages = await DirectMessage.find({ conversationId })
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
