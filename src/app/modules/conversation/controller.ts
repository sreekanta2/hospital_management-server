import { RequestHandler } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ConversationService } from "./service";

const getAllConversation: RequestHandler = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const result = await ConversationService.getAllConversation(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrieve  conversation   successfully",
    data: result || null,
  });
});
export const ConversationController = { getAllConversation };
