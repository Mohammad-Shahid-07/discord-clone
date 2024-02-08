import { MediaRoom } from "@/components/MediaRoom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { getChannelById, getMemberById } from "@/lib/actions/server.action";
import { currentProfile } from "@/lib/actions/user.action";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface PagaProps {
  params: {
    id: string;
    channelId: string;
  };
}
const Page = async ({ params }: PagaProps) => {
  const { id, channelId } = params;
  const profile = await currentProfile();
  console.log(profile);
  
  if (!profile) redirectToSignIn();
  const channel = await getChannelById({
    channelId: channelId,
    userId: profile._id,
    serverId: id,
  });
  const member = await getMemberById({ userId: profile._id, serverId: id });
  console.log(channel, member);
  
   if (!channel || !member) return redirect("/");

  return (
    <div className="bg-white relative dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={channel?.channel?.serverId}
        name={channel?.channel?.name}
        type="channel"
        userId={profile._id.toString()}
      />

      {channel?.channel?.type === "TEXT" && (
        <>
          <ChatMessages
            member={JSON.stringify(member)}
            name={channel?.channel?.name}
            chatId={channel?.channel?._id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel?.channel?._id,
              serverId: channel?.channel?.serverId,
            }}
            paramValue={channel?.channel?._id}
            paramKey="channelId"
          />

          <ChatInput
            name={channel?.channel?.name}
            query={{
              channelId: channel?.channel?._id.toString(),
              serverId: channel?.channel?.serverId,
            }}
            apiUrl="/api/socket/messages"
            type="channel"
          />
        </>
      )}
      {channel?.channel?.type === "AUDIO" && (
        <MediaRoom chatId={channel?.channel?._id} video={false} audio={true} />
      )}
      {channel?.channel?.type === "VIDEO" && (
        <MediaRoom chatId={channel?.channel?._id} video={true} audio={true} />
      )}
    </div>
  );
};

export default Page;
