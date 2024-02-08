"use client";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import ActionTooltip from "../ActionTooltip";
import { Edit, File, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { getUserbyId } from "@/lib/actions/user.action";
import { IUser } from "@/lib/database/user.model";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import qs from "query-string";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";
interface ChatItemProps {
  id: string;
  content: string;
  memberId: string;
  timestamp: string;
  fileUrl?: string | null;
  deleted: boolean;
  currentMember: string;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});
const ChatItem = ({
  id,
  content,
  memberId,
  timestamp,
  currentMember,
  fileUrl,
  deleted,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const params = useParams();
  const router = useRouter();
  const member = JSON.parse(memberId);
  const [profile, setProfile] = useState<IUser | null>();
  const [isEditing, setIsEditing] = useState(false);
  const [isPinning, setIsPinning] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const parseCurrentMember = JSON.parse(currentMember);
  const { onOpen } = useModal();
  const isAdmin = parseCurrentMember?.role === "ADMIN";
  const isModerator = parseCurrentMember?.role === "MODERATOR";
  const isOwner = member._id === parseCurrentMember._id;

  const canDelteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const canPinMessage = isAdmin || isModerator;
  const canDeleteAllMessage = isAdmin;

  const isPdf = fileUrl?.includes(".pdf") && fileUrl;
  const isImage = !isPdf && fileUrl;

  useEffect(() => {
    form.reset({ content });
  }, [content]);

  useEffect(() => {
    const handleKeydown = (e: any) => {
      if (e.key === "Escape") {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });
  useEffect(() => {
    const handleUser = async () => {
      try {
        const res = await getUserbyId(member?.profileId);
        setProfile(res);
      } catch (error) {
        console.log(error);
      }
    };
    handleUser();
  }, []);
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };
  const onMemberClick = () => {
    if (member._id === parseCurrentMember._id) return;

    router.push(`/server/${params?.id}/conversation/${member._id}`);
  };
  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={profile?.image} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div onClick={onMemberClick} className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {profile?.name}
              </p>
              <ActionTooltip label={member?.role || "GUEST"}>
                {roleIconMap[member.role as keyof typeof roleIconMap]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <Link
              href={fileUrl}
              target="_blank"
              rel="noopner noreferrer"
              className="relative aspect-square rounded-md h-48 w-48 border items-center bg-secondary flex "
            >
              <Image
                className="object-cover"
                alt={content}
                fill
                src={fileUrl}
              />
            </Link>
          )}
          {isPdf && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <File className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <Link href={fileUrl} className="ml-2 text-indigo-400">
                PDF File
              </Link>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1",
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2  text-zinc-500 dark:text-zinc-400">
                  {" "}
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center gap-x-2 w-full pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name={"content"}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0
                        text-zinc-600 dark:text-zinc-300"
                            placeholder="edited message"
                            {...field}
                            value={field.value}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  disabled={isLoading}
                  size={"sm"}
                  type="submit"
                  variant={"primary"}
                >
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400 ">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDelteMessage && (
        <div className="hidden group-hover:flex absolute p-1  -top-2 right-5 bg-white border rounded-sm dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto h-4 text-zinc-500 hover:text-zinc-600 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash2
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer ml-auto h-4 text-rose-500 hover:text-rose-600 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
