"use client";

import { cn } from "@/lib/utils";
import ActionTooltip from "../ActionTooltip";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/server/${id}`);
  }
  return (
    <ActionTooltip label={name} side="right" align="center">
      <button className="group flex items-center" onClick={onClick}>
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-full transition-all w-1",
            params?.id !== id && "group-hover:h-5",
            params?.id === id ? "h-8" : "h-2",
          )}
        />
        <div
          className={cn(
            "relative group flex items-center justify-end ml-2   h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden  ",

            params?.id === id && "bg-primary/10 text-primary rounded-[16px]",
          )}
        >
          <Image
            src={imageUrl}
            alt={name}
            width={48}
            height={48}
            className="rounded-[24px]"
          />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
