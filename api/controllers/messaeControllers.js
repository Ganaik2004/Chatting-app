import { errorHandler } from "../utils/error.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import Chat from "../models/chatmodel.js";

export const sendMessage = async(req,res,next)=>{
    const {content,chatId} = req.body;
    if(!content || !chatId){
        return next(errorHandler(404,"Invalid Data passed into requests"))
    }
    let newMessage={
        sender:req.user.id,
        content:content,
        chat:chatId
    }
    try{
         let message = await Message.create(newMessage);
         message = await message.populate("sender","name pic")
         message = await message.populate("chat")
         message = await User.populate(message,{
          path:"chat.users",
          select:"name pic email"
    });
 await Chat.findByIdAndUpdate(req.body.chatId,{
    latestMessage:message
 });
 res.status(200).json(message);
    }catch(error){
        return next(errorHandler(500,error.message))
    }
}
export const allMessages = async(req,res,next)=>{
   try{
const messages = await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat");
res.status(200).json(messages);         
   }catch(error){
    return next(errorHandler(500,error.message));
   }
}