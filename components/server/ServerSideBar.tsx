import { getServer } from "@/lib/actions/server.action";
import { currentProfile } from "@/lib/actions/user.action";
import { redirectToSignIn } from "@clerk/nextjs";
import { ServerHeader } from "./ServerHeader";
import { MemberRoleWithProfile } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./ServerSearch";
import { Crown, Hash, Mic, ShieldCheck, VideoIcon } from "lucide-react";
import { IChannel } from "@/lib/database/channel.model";
import { IMemberRole } from "@/lib/database/memberRole.model";
import { Separator } from "../ui/separator";
import ServerSection from "./ServerSection";
import ServerChannel from "./ServerChannel";
import ServerMember from "./ServerMember";

interface ServerSideBarProps {
  serverId: string;
  userId: string;
}
interface IconMap {
  TEXT: JSX.Element;
  AUDIO: JSX.Element;
  VIDEO: JSX.Element;
}

interface RoleIconMap {
  ADMIN: JSX.Element;
  MODERATOR: JSX.Element;
  GUEST: null;
}

const iconMap: IconMap = {
  TEXT: <Hash className="w-4 h-4 mr-2" />,
  AUDIO: <Mic className="w-4 h-4 mr-2" />,
  VIDEO: <VideoIcon className="w-4 h-4 mr-2" />,
};

const roleIconMap: RoleIconMap = {
  ADMIN: <Crown className="w-4 h-4 m-2" />,
  MODERATOR: <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />,
  GUEST: null,
};

const ServerSideBar = async ({ serverId, userId }: ServerSideBarProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  const server = await getServer({ serverId, userId });

  const stingMembers = JSON.stringify(server?.members);
  const role = server?.members?.find(
    (member: MemberRoleWithProfile) =>
      member.profileId?._id.toString() === userId.toString(),
  )?.role;

  return (
    <div className="flex flex-col h-full text-pretty w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server?.server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "Channel",
                data: server?.textChannels?.map((channel: IChannel) => ({
                  id: channel._id,
                  name: channel.name,
                  icon: iconMap[channel.type as "VIDEO" | "AUDIO" | "TEXT"],
                })),
              },
              {
                label: "Voice Channels",
                type: "Channel",
                data: server?.voiceChannels?.map((channel: IChannel) => ({
                  id: channel._id,
                  name: channel.name,
                  icon: iconMap[channel.type as "AUDIO" | "VIDEO" | "TEXT"],
                })),
              },
              {
                label: "Video Channels",
                type: "Channel",
                data: server?.videoChannels?.map((channel: IChannel) => ({
                  id: channel._id,
                  name: channel.name,
                  icon: iconMap[channel.type as "VIDEO" | "AUDIO" | "TEXT"],
                })),
              },

              {
                label: "Members",
                type: "Member",
                data: server?.members?.map((member: MemberRoleWithProfile) => ({
                  id: member.profileId?._id,
                  name: member.profileId?.name,
                  icon: roleIconMap[member?.role as "ADMIN" | "MODERATOR" | "GUEST"],
                })),
              },
            ]}
          />
        </div>
        <Separator />
        {!!server?.textChannels?.length && (
          <div>
            <ServerSection
              sectionType="Channel"
              label="Text Channels"
              role={role}
              channelType={"TEXT"}
            />
            {server?.textChannels?.map((channel: IChannel) => (
              <ServerChannel
                key={channel._id}
                channel={JSON.stringify(channel)}
                server={JSON.stringify(server.server)}
                role={role}
              />
            ))}
          </div>
        )}
        {!!server?.textChannels?.length && (
          <div>
            <ServerSection
              sectionType="Channel"
              label="Audio Channels"
              role={role}
              channelType={"AUDIO"}
            />
            {server?.voiceChannels?.map((channel: IChannel) => (
              <ServerChannel
                key={channel._id}
                channel={JSON.stringify(channel)}
                server={JSON.stringify(server.server)}
                role={role}
              />
            ))}
          </div>
        )}
        {!!server?.textChannels?.length && (
          <div>
            <ServerSection
              sectionType="Channel"
              label="Video Channels"
              role={role}
              channelType={"VIDEO"}
            />
            {server?.videoChannels?.map((channel: IChannel) => (
              <ServerChannel
                key={channel._id}
                channel={JSON.stringify(channel)}
                server={JSON.stringify(server.server)}
                role={role}
              />
            ))}
          </div>
        )}
        <Separator />
        {!!server?.members?.length && (
          <div>
            <ServerSection sectionType="Member" label="Members" role={role} />
            {JSON.parse(stingMembers)?.map((member: IMemberRole) => (
              <ServerMember
                key={member._id}
                member={member}
                stringServer={JSON.stringify(server.server)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSideBar;
