import express from "express";

import { verifyJwt } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";
import { zodRequestValidationHandler } from "../../middlewares/zod.middleware";
import { UserController } from "./controller";
import { UserZodValidation } from "./zodValidation";
const router = express.Router();
router
  .route("/doctor-register")
  .post(
    upload.single("avatar"),
    zodRequestValidationHandler(UserZodValidation.createUserZodSchema),
    UserController.doctorRegister
  );
router
  .route("/patient-register")
  .post(
    upload.single("avatar"),
    zodRequestValidationHandler(UserZodValidation.createUserZodSchema),
    UserController.patientRegister
  );
router.route("/:id").get(verifyJwt, UserController.getSingleUser);
router.route("/:id").delete(verifyJwt, UserController.deleteUser);
export const UserRoutes = router;
