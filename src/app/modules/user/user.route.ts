import express from "express";

import { verifyJwt } from "../../middlewares/auth.middleware";
import { zodRequestValidationHandler } from "../../middlewares/zod.middleware";
import { UserController } from "./user.controller";
import { UserZodValidation } from "./user.zodValidation";
const router = express.Router();
router
  .route("/doctor-register")
  .post(
    zodRequestValidationHandler(UserZodValidation.createUserZodSchema),
    UserController.doctorRegister
  );
router
  .route("/patient-register")
  .post(
    zodRequestValidationHandler(UserZodValidation.createUserZodSchema),
    UserController.patientRegister
  );
router.route("/:id").get(verifyJwt, UserController.getSingleUser);
export const UserRoutes = router;
