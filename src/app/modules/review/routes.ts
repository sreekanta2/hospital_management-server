import express from "express";
import { verifyJwt } from "../../middlewares/auth.middleware";
import { zodRequestValidationHandler } from "../../middlewares/zod.middleware";
import { ReviewController } from "./controller";
import { ReviewZodValidation } from "./zodValidation";

const router = express.Router();

router.route("/create-review").post(
  verifyJwt,

  zodRequestValidationHandler(ReviewZodValidation.reviewSchema),
  ReviewController.createReview
);
router.route("/update/:id").patch(
  verifyJwt,

  zodRequestValidationHandler(ReviewZodValidation.updateReviewSchema),
  ReviewController.updatedReview
);

router.route("/:id").get(ReviewController.getSingleReview);
router.route("/:id").delete(ReviewController.deleteReview);
// // router.route("/").get(DoctorController.getAllDoctor);

export const ReviewRoutes = router;
