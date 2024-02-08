"use server";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import User from "../database/user.model";
import { connectToDatabase } from "../mongoose";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

export const intialProfile = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return redirectToSignIn();
    }

    connectToDatabase();
    const profile = await User.findOne({ clerkId: user.id });

    if (profile) {
      return profile;
    }
    const newProfile = await User.create({
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      image: user.imageUrl,
    });
    return newProfile;
  } catch (error) {
    console.log(error);
  }
};

export const currentProfile = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return redirectToSignIn();
    }
    connectToDatabase();
    const profile = await User.findOne({ clerkId: user.id });
    return profile;
  } catch (error) {
    console.log(error);
  }
};

export const currentProfilePages = async (req: NextApiRequest) => {
  try {
    const { userId } = getAuth(req);
    connectToDatabase();
    const profile = await User.findOne({ clerkId: userId });
    return profile;
  } catch (error) {
    console.log(error);
  }
};

export async function getUserbyId(userId: string) {
  try {
    connectToDatabase();
    const user = await User.findOne({ _id: userId });
    if (!user) return;

    return user;
  } catch (error) {
    console.log(error);
  }
}
