import { Router } from "express";
import { userAdminController } from "../controllers/userAdminController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { updateUserStatusValidator } from "../validators/userAdminValidator.js";
import { handleValidation } from "../middleware/validationMiddleware.js";

const router = Router();

router.get("/", authenticate, authorizeRoles("ADMIN"), userAdminController.listUsers);
router.put("/:userId/status", authenticate, authorizeRoles("ADMIN"), updateUserStatusValidator, handleValidation, userAdminController.updateUserStatus);
router.get("/customers", authenticate, authorizeRoles("ADMIN", "AGENT"), userAdminController.listCustomers);

//view single user profile- admin only
router.get("/:userId", authenticate, authorizeRoles("ADMIN"), userAdminController.getUserById);

//assign role to user
router.post("/:userId/roles", authenticate, authorizeRoles("ADMIN"), userAdminController.assignRole);

//remove role from user
router.delete("/:userId/roles/:roleId", authenticate, authorizeRoles("ADMIN"), userAdminController.removeRole);

export default router;