"use client";
import { cn } from "@/lib/utils";
import { Edit, Hash, Lock, Mic, Trash, VideoIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import ActionTooltip from "../ActionTooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
  channel: string;
  server?: string;
  role?: string;
}

const iconMap = {
  TEXT: Hash,
  AUDIO: Mic,
  VIDEO: VideoIcon,
};
const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();
  const parsedChannel = JSON.parse(channel);
  const parsedServer = JSON?.parse(server!);

  const Icon = iconMap[parsedChannel.type as keyof typeof iconMap];
  const onClick = () => {
    router.push(`/server/${parsedServer._id}/channels/${parsedChannel._id}`);
  };
  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel: parsedChannel, server: parsedServer });
  };
  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/70 transition mb-1",
        params?.channelId === parsedChannel._id &&
          "bg-zinc-700/70 dark:bg-zinc-700",
      )}
      onClick={onClick}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-transform" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-200 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === parsedChannel._id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {parsedChannel.name}
      </p>
      {parsedChannel.name !== "general" && role !== "GUEST" && (
        <div className="ml-auto items-center flex gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, "editChannel")}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, "deleteChannel")}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
      {parsedChannel.name === "general" && (
        <div className="ml-auto items-center flex gap-x-2">
          <ActionTooltip label="You can EDIT General">
            <Lock className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
          </ActionTooltip>
        </div>
      )}
    </button>
  );
};

export default ServerChannel;
