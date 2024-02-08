import { getServerList } from "@/lib/actions/server.action";
import { UserButton, currentUser, redirectToSignIn } from "@clerk/nextjs";
import React from "react";
import NavigationAction from "./NavigationAction";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./NavigationItem";
import { ModeToggle } from "../providers/mode-toggle";

const NavigationSidebar = async () => {
  const profile = await currentUser();
  if (!profile) {
    return redirectToSignIn();
  }
  const userServers = await getServerList(profile.id);
 

  return (
    <div
      className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-
  3"
    >
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {userServers?.map((server: any) => (
          <div key={server._id} className="mb-4">
            <NavigationItem
              id={server._id}
              name={server.name}
              imageUrl={server.imgUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mx-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton 
        afterSignOutUrl="/"
        appearance={ {
          elements: {
            avatarBox: "h-10 w-10 rounded-full overflow-hidden",
          }
        }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
