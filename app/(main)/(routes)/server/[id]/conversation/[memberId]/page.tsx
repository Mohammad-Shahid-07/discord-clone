import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { getMemberById } from "@/lib/actions/server.action";
import { currentProfile } from "@/lib/actions/user.action";
import { getOrCreateConversation } from "@/lib/conversation";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    id: string;
    memberId: string;
  };
}
const Page = async ({ params }: PageProps) => {
  const profile = await currentProfile();
  if (!profile) redirectToSignIn();

  const currentMember = await getMemberById({
    memberId: params.memberId,
    userId: profile._id,
    serverId: params.id,
  });

  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(
    currentMember._id,
    params.memberId,
  );

  if (!conversation) return redirect(`/server/${params.id}`);
  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne?.profileId.toString() === profile?._id.toString()
      ? memberTwo
      : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={params.id}
        name={otherMember?.profileId.name}
        type="conversation"
        imgUrl={otherMember?.image}
        userId={profile._id.toString()}
      />
      <ChatMessages
        member={JSON.stringify(currentMember)}
        name={otherMember?.name}
        chatId={conversation._id}
        type="conversation"
        apiUrl="/api/direct-messages"
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: conversation._id,
        }}
        paramValue={conversation._id}
        paramKey="conversationId"
      />
      <ChatInput
        name={otherMember?.name}
        query={{
          conversationId: conversation._id.toString(),
        }}
        apiUrl="/api/socket/direct-messages"
        type="conversation"
      />
    </div>
  );
};

export default Page;
