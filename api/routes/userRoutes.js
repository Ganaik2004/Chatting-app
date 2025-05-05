import express from  "express"
import { getUser, login, signout, signup } from "../controllers/userContollers.js";
import { verifyToken } from "../utils/verify.js";
const router = express.Router();
router.post("/login",login)
router.post("/signup",signup)
router.get('/search',verifyToken,getUser);
router.get('/signout',signout);
export default router;