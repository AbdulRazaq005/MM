import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createNewContact,
  deleteContactById,
  getAllContacts,
  updateContactById,
} from "../controllers/contactController.js";

const router = express.Router();

router.get("/", protect, getAllContacts);
router.post("/", protect, createNewContact);
router.put("/:id", protect, updateContactById);
router.delete("/:id", protect, deleteContactById);

export default router;
