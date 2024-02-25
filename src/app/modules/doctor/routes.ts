import express from "express";
import { verifyJwt } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";
import { DoctorController } from "./controller";
const router = express.Router();

router.route("/").get(DoctorController.getAllDoctor);

router.route("/update/:id").patch(
  verifyJwt,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "gallery",
      maxCount: 4,
    },
  ]),
  DoctorController.updateDoctor
);

export const DoctorRoutes = router;
