"use server";

import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import Server, { IServer } from "../database/server.model";
import { v4 as uuidv4 } from "uuid";
import { connectToDatabase } from "../mongoose";
import Channel, { IChannel } from "../database/channel.model";
import MemberRole, { IMemberRole } from "../database/memberRole.model";
import User from "../database/user.model";
import { redirect } from "next/navigation";
import {
  KickUserParams,
  MemberRoleWithProfile,
  changeRoleParams,
  createChannelParams,
} from "@/types";
import { currentProfile } from "./user.action";
import { revalidatePath } from "next/cache";
export async function createServer(values: any) {
  try {
    connectToDatabase(); // Connect to the database (assuming this function exists)

    const { name, imageUrl } = values;

    const profile = await currentUser();
    if (!profile) {
      return redirectToSignIn();
    }

    const user = await User.findOne({ clerkId: profile.id });

    const member = await MemberRole.create({
      role: "ADMIN",
      profileId: user._id,
    });

    const channel = await Channel.create({
      name: "general",
      type: "TEXT",
      profileId: user._id,
    });

    const server = await Server.create({
      name,
      imgUrl: imageUrl,
      inviteCode: uuidv4(),
      members: [member._id], // Save member ID in the members array
      channels: [channel._id], // Save channel ID in the channels array
      profileId: user._id,
    });

    channel.serverId = server._id;
    await channel.save();
    member.serverId = server._id;
    await member.save();

    // Save the server ID in the user's servers array
    user.servers.push(server._id);
    await user.save();
  } catch (error) {
    console.log(error);
    // Handle error appropriately
  }
}

export async function getServerList(values: any) {
  try {
    connectToDatabase();
    const profile = await currentUser();

    if (!profile) {
      return redirectToSignIn();
    }
    const user = await User.findOne({ clerkId: profile.id }).populate(
      "servers",
    );

    return user.servers;
  } catch (error) {
    console.log(error);
  }
}

export async function getServer(values: any) {
  try {
    connectToDatabase();
    const { serverId, userId } = values;
    const server = await Server.findOne({ _id: serverId })
      .populate({
        path: "members",
        populate: {
          path: "profileId",
        },
      })
      .populate("channels");

    const memberIds = server?.members.map((member: MemberRoleWithProfile) =>
      member.profileId?._id.toString(),
    );

    if (
      !server ||
      !server?.members ||
      !memberIds?.includes(userId.toString())
    ) {
      return;
    }

    const textChannels = server?.channels.filter(
      (channel: IChannel) => channel.type === "TEXT",
    );
    const voiceChannels = server?.channels.filter(
      (channel: IChannel) => channel.type === "AUDIO",
    );
    const videoChannels = server?.channels.filter(
      (channel: IChannel) => channel.type === "VIDEO",
    );
    const members = server?.members.filter(
      (member: MemberRoleWithProfile) => member?.profileId?._id !== userId,
    );

    return { server, members, videoChannels, voiceChannels, textChannels };
  } catch (error) {
    console.log(error);
  }
}

export async function genrateNewInviteCode(serverId: string) {
  try {
    connectToDatabase();
    const profile = await currentUser();
    if (!profile) {
      return;
    }
    const server = await Server.findOne({ _id: serverId });
    if (!server) {
      return;
    }
    const user = await User.findOne({ clerkId: profile.id });
    if (!user) {
      return;
    }

    if (server.profileId.toString() !== user._id.toString()) {
      return;
    }

    server.inviteCode = uuidv4();
    await server.save();

    return server;
  } catch (error) {
    console.log(error);
  }
}

export async function joinServerByInviteCode(inviteCode: string) {
  try {
    connectToDatabase();

    const profile = await currentUser();
    if (!profile) {
      return redirectToSignIn();
    }

    const user = await User.findOne({ clerkId: profile.id });

    const server = await Server.findOne({ inviteCode }).populate("members");
    // Check if server exists
    if (!server) {
      console.log("Server not found");
      return false;
    }

    // Check if server.members is an array and if user._id exists in it
    if (
      Array.isArray(server.members) &&
      server.members.some((member : MemberRoleWithProfile) => member.profileId === user._id)
    ) {
      console.log("Already a member");
      return false;
    }
    const member = await MemberRole.create({
      role: "GUEST",
      profileId: user._id,
      serverId: server._id,
    });

    server.members.push(member._id);
    user.servers.push(server._id);
    await server.save();
    await user.save();
    return true;
  } catch (error) {
    console.log(error);
  }
}

export async function editServer(params: any) {
  try {
    connectToDatabase();
    const { serverId, name, imageUrl } = params;
    const profile = await currentUser();
    if (!profile) {
      return redirectToSignIn();
    }

    const user = await User.findOne({ clerkId: profile.id });
    const server = await Server.findOne({ _id: serverId });

    if (!server) {
      return;
    }

    if (server.profileId.toString() !== user._id.toString()) {
      return;
    }

    server.name = name;
    server.imgUrl = imageUrl;

    await server.save();
    return server;
  } catch (error) {
    console.log(error);
  }
}

export async function changeRole({
  serverId,
  memberId,
  role,
}: changeRoleParams) {
  try {
    connectToDatabase();

    const profile = await currentUser();
    if (!profile) {
      return redirectToSignIn();
    }

    if (!serverId || !role || !memberId) {
      return;
    }

    const user = await User.findOne({ clerkId: profile.id });

    if (!user) return;

    const server = await Server.findOne({
      _id: serverId,
      profileId: user._id,
    });

    if (!server) {
      return;
    }
    if (memberId.toString() === user._id.toString()) {
      return "Admin cannot change their own role";
    }

    const memberToUpdate = server.members.find(
      (member: IMemberRole) => member.toString() === memberId,
    );

    const member = await MemberRole.findOne({
      _id: memberId,
    });

    if (!memberToUpdate) {
      return "Member not found";
    }

    // Update the role for the member
    member.role = role;

    await member.save();
    await server.save();
    return server;
  } catch (error) {
    console.log(error);
  }
}

export async function kickUser({ serverId, memberId }: KickUserParams) {
  try {
    connectToDatabase();

    const profile = await currentUser();
    if (!profile) {
      return redirectToSignIn();
    }

    if (!serverId || !memberId) {
      return;
    }

    const user = await User.findOne({ clerkId: profile.id });

    if (!user) return;

    const server = await Server.findOne({
      _id: serverId,
      profileId: user._id,
    });

    if (!server) {
      return;
    }

    if (memberId.toString() === user?._id.toString()) {
      return "Admin cannot kick themselves";
    }

    const memberToUpdate = server.members.find(
      (member: IMemberRole) => member.toString() === memberId,
    );

    if (!memberToUpdate) {
      return "Member not found";
    }

    server.members = server.members.filter(
      (member: IMemberRole) => member.toString() !== memberId,
    );

    await server.save();
    // return server;
  } catch (error) {
    console.log(error);
  }
}

export async function createChannel({
  serverId,
  name,
  type,
}: createChannelParams) {
  try {
    const profile = await currentUser();
    if (!profile) {
      return redirectToSignIn();
    }
    if (!serverId || !type || name === "general") return;

    const user = await User.findOne({ clerkId: profile.id });

    if (!user) return;
    const server = await Server.findOne({
      _id: serverId,
      profileId: user._id,
    })
      .populate({
        path: "members",
        match: {
          profileId: user._id,
          role: { $in: ["ADMIN", "MODERATOR"] }, // Check if role is ADMIN or MODERATOR
        },
      })
      .exec();

    if (!server) {
      return;
    }

    // Check if the user has either an ADMIN or MODERATOR role
    const isAdminOrModerator = server.members.length > 0;

    if (!isAdminOrModerator) {
      // User does not have the required role
      return;
    }
    const newChannel = await Channel.create({
      profileId: user._id,
      name,
      type,
      serverId,
    });
    server.channels.push(newChannel._id);
    await server.save();
  } catch (error) {
    console.log(error);
  }
}

export async function leaveServer(serverId: string) {
  try {
    connectToDatabase();
    const profile = await currentUser();

    if (!profile) {
      return redirectToSignIn();
    }

    const user = await User.findOne({ clerkId: profile.id });
    if (!user) {
      return;
    }
    const server = await Server.findOne({
      _id: serverId,
    }).populate("members");

    if (!server) {
      return;
    }
    const member = server.members.find(
      (member: IMemberRole) =>
        member.profileId.toString() === user._id.toString(),
    );

    if (!member) {
      return;
    }
    if (server.profileId.toString() === user._id.toString()) {
      return;
    }
    server.members = server.members.filter(
      (member: IMemberRole) =>
        member.profileId.toString() !== user._id.toString(),
    );

    await server.save();
    user.servers = user.servers.filter(
      (serverId: string) => serverId.toString() !== server._id.toString(),
    );

    await user.save();
  } catch (error) {
    console.log(error);
  }
}

export async function deleteServer(serverId: string) {
  try {
    connectToDatabase();
    const profile = await currentUser();

    if (!profile) {
      return redirectToSignIn();
    }

    const users = await User.find({ servers: serverId });

    // Remove server references from users
    await Promise.all(
      users.map(async (user) => {
        user.servers = user.servers.filter(
          (_id: string) => _id.toString() !== serverId.toString(),
        );
        await user.save();
      }),
    );

    // Remove server references from MemberRole schema
    await MemberRole.deleteMany({ serverId });

    // Remove server references from Channel schema
    await Channel.deleteMany({ serverId });

    // Delete the server
    await Server.deleteOne({
      _id: serverId,
      profileId: profile.id,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteChannel(
  serverId: string,
  channelId: string,
  path: string,
) {
  try {
    connectToDatabase();
    const profile = await currentUser();

    if (!profile) {
      return redirectToSignIn();
    }

    const user = await User.findOne({ clerkId: profile.id });

    if (!user) {
      return;
    }

    const channel = await Channel.findOne({ _id: channelId });

    if (!channel || channel.name === "general") {
      return;
    }

    const server = await Server.findOne({
      _id: serverId,
      profileId: user._id,
    });

    if (!server) {
      return;
    }

    server.channels = server.channels.filter(
      (channelId: string) => channelId.toString() !== channel._id.toString(),
    );

    await server.save();
    await Channel.deleteOne({ _id: channelId });
    revalidatePath(path);
    return;
  } catch (error) {
    console.log(error);
  }
}

export async function editChannel({
  channelId,
  serverId,
  pathname,
  name,
  type,
}: any) {
  try {
    connectToDatabase();
    const profile = await currentUser();

    if (!profile) {
      return redirectToSignIn();
    }

    const user = await User.findOne({ clerkId: profile.id });

    if (!user) {
      return;
    }
    if (
      !channelId ||
      !serverId ||
      !pathname ||
      !name ||
      !type ||
      name === "genral"
    ) {
      return;
    }
    const channel = await Channel.findOne({ _id: channelId });

    if (!channel) {
      return;
    }

    const server = await Server.findOne({
      _id: serverId,
      profileId: user._id,
    });

    if (!server) {
      return;
    }

    channel.name = name;
    channel.type = type;

    await channel.save();
    revalidatePath(pathname);
    return;
  } catch (error) {
    console.log(error);
  }
}

export async function getServerById(serverId: string) {
  try {
    connectToDatabase();
    const profile = await currentUser();

    if (!profile || !serverId) {
      return redirectToSignIn();
    }

    const user = await User.findOne({ clerkId: profile.id });

    if (!user) {
      return;
    }
    const server = await Server.findOne({ _id: serverId }).populate(
      "members channels",
    );

    const isUserInServer = server.members.find(
      (member: IMemberRole) =>
        member.profileId.toString() === user._id.toString(),
    );

    if (!isUserInServer) {
      return;
    }
    return server;
  } catch (error) {
    console.log(error);
  }
}

export async function getChannelById({ serverId, channelId, userId }: any) {
  try {
    connectToDatabase();
    const profile = await currentUser();

    if (!profile || !serverId || !channelId) {
      return redirectToSignIn();
    }

    const member = await MemberRole.find({
      serverId,
      profileId: userId,
    });

    const channel = await Channel.findOne({ _id: channelId });

    if (!member || !channel) {
      return;
    }
    return { channel, member };
  } catch (error) {
    console.log(error);
  }
}

export async function getMemberById({ userId, serverId }: any) {
  try {
    connectToDatabase();

    const member = await MemberRole.findOne({
      serverId: serverId.toString(),
      profileId: userId.toString(),
    }).populate("profileId");
    console.log({ member });

    return member;
  } catch (error) {
    console.log(error);
  }
}
