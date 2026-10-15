import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, requireAdmin, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: "Nessun file ricevuto" });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

export default router;