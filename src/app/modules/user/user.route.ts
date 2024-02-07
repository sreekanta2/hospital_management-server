import express from "express";

import { verifyJwt } from "../../middlewares/auth.middleware";
import { zodRequestValidationHandler } from "../../middlewares/zod.middleware";
import { UserController } from "./user.controller";
import { UserZodValidation } from "./user.zodValidation";
const route = express.Router();
route
  .route("/create-doctor")
  .post(
    zodRequestValidationHandler(UserZodValidation.createUserZodSchema),
    UserController.createDoctor
  );
route
  .route("/login")
  .post(
    zodRequestValidationHandler(UserZodValidation.loginUserZodSchema),
    UserController.login
  );
route.route("/logout").post(verifyJwt, UserController.logoutUser);
// route.post("/create-patient", UserController.createPatient);
export const UserRoutes = route;
