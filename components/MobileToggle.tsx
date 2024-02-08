import { Menu } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import NavigationSidebar from "./navigation/navigation-sidebar";
import ServerSideBar from "./server/ServerSideBar";

const MobileToggle = ({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" variant={"ghost"} size={"icon"}>
          <Menu className="w-5 h-5 text-zinc-50 dark:text-zinc-400 mr-2" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 flex  gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSideBar serverId={serverId} userId={userId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
