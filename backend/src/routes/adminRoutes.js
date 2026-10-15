import { Router } from "express";
import {
  listOrders,
  getOrder,
  updateOrderStatus,
  listUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/adminController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/orders", listOrders);
router.get("/orders/:id", getOrder);
router.put("/orders/:id/status", updateOrderStatus);

router.get("/users", listUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;