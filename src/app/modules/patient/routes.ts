import express from "express";
import { verifyJwt } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";
import { zodRequestValidationHandler } from "../../middlewares/zod.middleware";
import { PatientController } from "./controller";
import { PatientZodValidation } from "./zodValidation";

const router = express.Router();

router.route("/").get(PatientController.getAllPatient);

router.route("/update/:id").patch(
  verifyJwt,
  upload.single("avatar"),
  zodRequestValidationHandler(PatientZodValidation.updatePatientZodSchema),

  PatientController.updatePatient
);
router.route("/:id").delete(PatientController.deletePatient);
router.route("/:id").get(PatientController.getSinglePatient);

export const PatientRoutes = router;
