"use client";
import { IChannel } from "@/lib/database/channel.model";
import { IMemberRole } from "@/lib/database/memberRole.model";
import { IServer } from "@/lib/database/server.model";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage"
  ;


interface ModalData {
  server?: IServer;
  channelType?: "TEXT" | "AUDIO" | "VIDEO";
  channel?: IChannel;
  apiUrl?: string;
  query?: Record<string, any>;
}
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (modal: ModalType, data?: ModalData) => void;
  onClose: () => void;
}
export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
