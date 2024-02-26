import express from "express";
import {
  getUsers,
  updateUsers,
  updateProfilUsers,
  Register,
  Login,
  Logout,
} from "../controller/userController.js";
import {
  getAdmin,
  updateAdmin,
  adminRegister,
  adminLogin,
} from "../controller/adminController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controller/refreshToken.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.post("/updateUsers", updateUsers);
router.post("/updateProfilUsers", updateProfilUsers);
router.post("/users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);


router.get("/admin", verifyToken, getAdmin);
router.post("/updateAdmin", updateAdmin);
router.post("/admin", adminRegister);
router.post("/adminLogin", adminLogin);
router.delete("/adminLogout", Logout);

export default router;
