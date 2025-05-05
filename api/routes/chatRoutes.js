import express from "express"
import { verifyToken } from "../utils/verify.js";
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup, renameGroupPic } from "../controllers/chatControllers.js";
const router = express.Router();
router.get("/a",verifyToken,fetchChats);
router.post("/acc",verifyToken,accessChat);
router.post("/group",verifyToken,createGroupChat);
router.put("/renamegroup",verifyToken,renameGroup);
router.put("/renamegroupPic",verifyToken,renameGroupPic);
router.put("/groupremove",verifyToken,removeFromGroup);
router.put("/groupadd",verifyToken,addToGroup);
export default router;