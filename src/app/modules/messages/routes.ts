import express from "express";
import { verifyJwt } from "../../middlewares/auth.middleware";
import { zodRequestValidationHandler } from "../../middlewares/zod.middleware";
import { MessageController } from "./controller";
import { messageZodValidation } from "./zodValidation";

const router = express.Router();

router.route("/send/:id").post(
  verifyJwt,
  zodRequestValidationHandler(messageZodValidation.messageSchemaZod),

  MessageController.sendMessage
);
router.route("/:id").get(verifyJwt, MessageController.getMessage);

export const MessagesRoutes = router;
