"use server";

import Conversation from "./database/conversation.model";
import { connectToDatabase } from "./mongoose";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  try {
    connectToDatabase();
    let conversation =
      (await findConversation(memberOneId, memberTwoId)) ||
      (await findConversation(memberTwoId, memberOneId));
    if (!conversation) {
      conversation = await createNewConversation(memberOneId, memberTwoId);
    }
    return conversation;
  } catch (error) {
    console.log(error);
  }
};
export const findConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  try {
    connectToDatabase();
    const conversation = await Conversation.findOne({
      memberOne: memberTwoId,
      memberTwo: memberOneId,
    })
      .populate({
        path: "memberOne",
        populate: { path: "profileId" },
      })
      .populate({
        path: "memberTwo",
        populate: { path: "profileId" },
      });

    return conversation;
  } catch (error) {
    console.log(error);
  }
};

export const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  try {
    connectToDatabase();
    const conversation = await Conversation.create({
      memberOne: memberOneId,
      memberTwo: memberTwoId,
    });
    return conversation;
  } catch (error) {
    console.log(error);
  }
};
