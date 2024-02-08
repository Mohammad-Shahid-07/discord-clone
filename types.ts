import { IMemberRole } from "@/lib/database/memberRole.model";
import { IUser } from "@/lib/database/user.model";
import { IServer } from "@/lib/database/server.model";
import { Schema } from "mongoose";
import { ReactNode } from "react";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
export type ServerWithMembersWithProfiles = IServer & {
  members: (IMemberRole & { profile: IUser })[];
};

export type MemberRoleWithProfile = {
  role: string;
  profileId: IUser;
  serverId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type RoleIconMap = {
  Guest: null;
  MODERATOR: ReactNode;
  ADMIN: ReactNode;
};

export type changeRoleParams = {
  serverId: string;
  memberId: string;
  role: string;
};
export type KickUserParams = {
  serverId: string;
  memberId: string;
};

export type createChannelParams = {
  name: string;
  type: string;
  serverId: string;
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};