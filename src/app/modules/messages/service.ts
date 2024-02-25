import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import { IPaginationOptions } from "../../../interfaces/common";
import { errorLogger } from "../../../shared/logger";
import ApiError from "../../../utils/ApiError";
import { paginationCalculator } from "../../../utils/paginationHelper";
import Conversation from "../conversation/model";
import { IMessage } from "./interface";
import Message from "./model";

const sendMessage = async (
  message: IMessage,
  receiverId: string,
  senderId: string
) => {
  try {
    let conversation = await Conversation.findOne({
      $and: [
        { "participants.receiver": receiverId },
        { "participants.sender": senderId },
      ],
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: { receiver: receiverId, sender: senderId },
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // this will run in parallel
    const sendMessage = await Promise.all([
      conversation.save(),
      newMessage.save(),
    ]);
    if (!sendMessage) {
      throw new ApiError(httpStatus.BAD_REQUEST, "message send field!!");
    }
    return sendMessage;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};

const getMessages = async (
  receiverId: string,
  senderId: string,
  option: IPaginationOptions
) => {
  const { limit, skip, sortBy, sortOrder } = paginationCalculator(option);
  const conditionalSorting: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    conditionalSorting[sortBy] = sortOrder;
  }
  try {
    const conversation = await Conversation.findOne({
      $and: [
        { "participants.receiver": receiverId },
        { "participants.sender": senderId },
      ],
    })
      .populate({
        path: "messages",
        options: { sort: conditionalSorting, skip: skip, limit: limit },
      })
      .populate("participants.receiver");

    // NOT REFERENCE BUT ACTUAL MESSAGES
    if (!conversation) {
      throw new ApiError(httpStatus.BAD_REQUEST, "message get field!!");
    }
    const messages = conversation.messages;

    return messages;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};

export const MessageService = { sendMessage, getMessages };
