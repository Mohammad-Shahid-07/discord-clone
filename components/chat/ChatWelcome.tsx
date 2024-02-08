import { Hash } from "lucide-react";
import React from "react";

interface ChatWelcomeProps {
  type: string;
  name: string;
}
const ChatWelcome = ({ type, name }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "channel" && (
        <div className="h-[75px] w-[75px] flex rounded-full dark:bg-zinc-700 bg-zinc-500 justify-center items-center">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? "welcome to #" : ""}
        {name}
      </p>
      <div className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === "channel"
          ? `This is the start of the #${name} channel.`
          : `This is the start of your conversation with ${name}.`}
      </div>
    </div>
  );
};

export default ChatWelcome;
