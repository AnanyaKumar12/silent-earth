import { Router } from "express";
import { createUser } from "../controllers/userController.js";

const router = Router();

// POST /api/users - create/update the local (no-auth) user profile
router.post("/", createUser);

export default router;
