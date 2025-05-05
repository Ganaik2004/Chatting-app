import express from 'express'
import { verifyToken } from '../utils/verify.js';
import { allMessages, sendMessage } from '../controllers/messaeControllers.js';
const router = express.Router();
 router.post('/',verifyToken,sendMessage);
 router.get("/:chatId",verifyToken,allMessages)
export default router;