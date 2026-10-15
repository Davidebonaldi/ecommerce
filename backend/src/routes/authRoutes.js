import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login } from "../controllers/authController.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Troppi tentativi, riprova tra qualche minuto" },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

export default router;