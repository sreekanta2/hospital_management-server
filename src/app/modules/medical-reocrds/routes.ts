import express from "express";
import { verifyJwt } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";
import { zodRequestValidationHandler } from "../../middlewares/zod.middleware";
import { MedicalRecordController } from "./controller";
import { MedicalRecordZodValidation } from "./zodValidation";

const router = express.Router();

router.route("/create").post(
  verifyJwt,
  upload.single("doc"),
  zodRequestValidationHandler(
    MedicalRecordZodValidation.medicalRecordZodSchema
  ),

  MedicalRecordController.createMedicalRecord
);
router
  .route("/update/:id")
  .patch(
    verifyJwt,
    upload.single("doc"),
    zodRequestValidationHandler(
      MedicalRecordZodValidation.updateRecordZodSchema
    ),
    MedicalRecordController.updateMedicalRecord
  );
router.route("/:id").get(MedicalRecordController.getPatientAllMedicalRecords);
router.route("/:id").delete(MedicalRecordController.deleteMedicalRecord);

export const MedicalRecordRoutes = router;
