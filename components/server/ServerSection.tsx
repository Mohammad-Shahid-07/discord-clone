"use client";
import { ServerWithMembersWithProfiles } from "@/types";
import React from "react";
import ActionTooltip from "../ActionTooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
  label: string;
  role?: string;
  sectionType: "Channel" | "Member";
  channelType?: "TEXT" | "AUDIO" | "VIDEO";
  server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== "GUEST" && sectionType === "Channel" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            className="w-6 h-6 rounded-md flex items-center justify-center  hover:bg-zinc-600 dark:hover:bg-zinc-700 transition-all"
            onClick={() => onOpen("createChannel", {channelType})}
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </ActionTooltip>
      )}
      {role === "ADMIN" && sectionType === "Member" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            className="w-6 h-6 rounded-md flex items-center justify-center  hover:bg-zinc-600 dark:hover:bg-zinc-700 transition-all"
            onClick={() => onOpen("members", { server })}
          >
            <Settings className="w-4 h-4 text-white" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
