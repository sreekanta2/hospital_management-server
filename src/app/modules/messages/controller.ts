import { RequestHandler } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { MessageService } from "./service";

const sendMessage: RequestHandler = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  const sendMessage = await MessageService.sendMessage(
    message,
    receiverId,
    senderId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " message send  successfully",
    data: sendMessage || null,
  });
});
const getMessage: RequestHandler = asyncHandler(async (req, res) => {
  const { id: receiverId } = req.params;
  const option = req.query;
  const senderId = req.user._id;
  const messages = await MessageService.getMessages(
    receiverId,
    senderId,
    option
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrieve  message   successfully",
    data: messages || null,
  });
});

export const MessageController = { sendMessage, getMessage };
