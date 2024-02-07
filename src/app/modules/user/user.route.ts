import express from "express";

import { verifyJwt } from "../../middlewares/auth.middleware";
import { UserController } from "./user.controller";
const route = express.Router();
route.route("/create-doctor").post(verifyJwt, UserController.createDoctor);
route.route("/login").post(UserController.login);
route.route("/logout").post(verifyJwt, UserController.logoutUser);
// route.post("/create-patient", UserController.createPatient);
export const UserRoutes = route;
