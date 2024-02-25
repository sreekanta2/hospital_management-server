import Conversation from "./model";

const getAllConversation = async (id: string) => {
  const result = await Conversation.find({
    "participants.sender": id,
  }).populate({
    path: "participants.receiver",
    select: ["avatar", "firstName", "lastName", "-_id"],
  });

  return result;
};

export const ConversationService = { getAllConversation };
