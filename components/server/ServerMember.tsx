"use client";
import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import UserAvatar from "../UserAvatar";

interface ServerMemberProps {
  member: any;
  stringServer: string;
}
const roleIconMap = {
  ADMIN: <ShieldAlert className="w-4 h-4 mr-2 text-red-500" />,
  MODERATOR: <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />,
  MEMBER: "👤",
};
const ServerMember = ({ member, stringServer }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();
  const server = JSON.parse(stringServer);
  const icon = roleIconMap[member.role as keyof typeof roleIconMap];
  const onClick = () => {
    router.push(`/server/${server._id}/conversation/${member.profileId._id}`);
  }
  return (
    <>
      <button
        onClick={onClick}
        key={member._id}
        className={cn(
          "group px-2 py-2 flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:bg-zinc-700/10 transition mb-1",
          params?.memberId === member?._id && "bg-zinc-700/20 dark:bg-zinc-700",
        )}
      >
        <UserAvatar
          src={member.profileId?.image}
          className="w-8 h-8 rounded-full"
        />

        <p
          className={cn(
            "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params?.memberId === member?._id  &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white",
          )}
        >
          {member.profileId?.name}
        </p>
        {icon}
      </button>
    </>
  );
};

export default ServerMember;
