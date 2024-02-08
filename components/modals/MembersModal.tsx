"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../UserAvatar";
import { RoleIconMap } from "@/types";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { changeRole, kickUser } from "@/lib/actions/server.action";

const roleIconMap: any = {
  Guest: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};
const MemberModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");
  const isModalOpen = isOpen && type === "members";
  const router = useRouter();
  const { server } = data;

  const onRoleChange = async (memberId: string, role: string) => {
    try {
      setLoadingId(memberId);
      const res = await changeRole({
        memberId,
        serverId: server?._id,
        role,
      });
      router.refresh();
    } catch (error) {
    } finally {
      setLoadingId("");
    }
  };
  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
       await kickUser({
        memberId,
        serverId: server?._id,
      });
      router.refresh();
    } catch (error) {
    } finally {
      setLoadingId("");
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member: any) => (
            <div
              key={member._id}
              className="flex items-center gap-x-2 px-6 py-4 border-b border-zinc-300"
            >
              <UserAvatar src={member?.profileId?.image} />
              <div className="flex flex-col gap-y-1">
                <span className="text-xs font-semibold gap-x-2 flex items-center">
                  {member?.profileId?.name}
                  {roleIconMap[member?.role]}
                </span>
                <span className="text-xs text-zinc-500">
                  {member?.profileId?.email}
                </span>
              </div>
              {server?.profileId.toString() !==
                member?.profileId?._id.toString() && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="w-4 h-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="w-4 h-4 mr-2" />
                          <span className="text-xs">Change Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member._id, "GUEST")}
                            >
                              <Shield className="w-4 h-4 mr-2" />{" "}
                              <span className="text-xs">Guest</span>
                              {member.role === "GUEST" && (
                                <Check className="w-4 h-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                onRoleChange(member._id, "MODERATOR")
                              }
                            >
                              <ShieldCheck className="w-4 h-4 mr-2" />{" "}
                              <span className="text-xs">Moderator</span>
                              {member.role === "MODERATOR" && (
                                <Check className="w-4 h-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKick(member._id)}>
                        <Gavel className="w-4 h-4 mr-2" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member._id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MemberModal;
