import express from "express";
const router = express.Router()
import registeredUser, { allUsers, authUser } from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").post(registeredUser);
router.post("/login", authUser)
router.route("/").get(protect, allUsers);

export default router;