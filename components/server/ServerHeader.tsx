
import { ServerWithMembersWithProfiles } from "@/types";

import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import ServerHeaderMenu from "./ServerHeaderMenu";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: string;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const stringServer = JSON.stringify(server)
  const isAdmin = role === "ADMIN";
  const isModerator = isAdmin || role === "MODERATOR";

  return (
   <ServerHeaderMenu stringServer={stringServer} role={role} />
  );
};
