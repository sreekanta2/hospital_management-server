import express from "express";
import { verifyJwt } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";
import { zodRequestValidationHandler } from "../../middlewares/zod.middleware";
import { PatientController } from "./patient.controller";
import { PatientZodValidation } from "./patient.zodValidation";

const router = express.Router();

router.route("/").get(PatientController.getAllPatient);
router.route("/create-patient").post(
  verifyJwt,
  upload.single("profile_thumb"),
  zodRequestValidationHandler(PatientZodValidation.patientZodSchema),

  PatientController.createPatient
);
router.route("/update/:id").patch(
  verifyJwt,
  upload.single("profile_thumb"),
  zodRequestValidationHandler(PatientZodValidation.updatePatientZodSchema),

  PatientController.updatePatient
);
router.route("/:id").delete(PatientController.deletePatient);
router.route("/:id").get(PatientController.getSinglePatient);

export const PatientRoutes = router;
