import { Router } from "express";
import { createOrder, getOrders, getOrder } from "../controllers/orderController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/:id", getOrder);

export default router;