import express from "express";
import { verifyJwt } from "../../middlewares/auth.middleware";
import { ConversationController } from "./controller";

const router = express.Router();

router.route("/").get(verifyJwt, ConversationController.getAllConversation);
// router.route("/:id").get(verifyJwt, MessageController.getMessage);

export const ConversationRoutes = router;
