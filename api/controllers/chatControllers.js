import Chat from "../models/chatmodel.js";
import User from '../models/user.js'
import { errorHandler } from "../utils/error.js";

export const accessChat = async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return next(errorHandler(404, "Please Send The UserID"));
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.status(200).json(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (err) {
      return next(errorHandler(404, err.message));
    }
  }
};
export const fetchChats = async (req, res, next) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).json(results);
      });
  } catch (err) {
    return next(errorHandler(404, err.message));
  }
};
export const createGroupChat = async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    return next(errorHandler(400, "Please fill all the fields"));
  }
  let users = JSON.parse(req.body.users);
  
  if (users.length < 2) {
    return next(
      errorHandler(400, "More than 2 users are required to form a group chat")
    );
  }
  users.push(req.user.id);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user.id,
      groupPic:req.body.pic,
    });
    const fullGroupChat = await Chat.findOne({_id:groupChat._id})
    .populate("users","-password")
    .populate("groupAdmin","-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    return next(errorHandler(400, error.message));
  }
};
export const renameGroup = async(req,res,next)=>{
    const { chatId,chatName} = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId,{
        chatName:chatName
        },
                    {
                        new:true,
                
    }).populate("users","-password")
    .populate("groupAdmin","-password");
    if(!updatedChat){
        return next(errorHandler(404,"Chat not found"));
    }else{
        res.status(200).json(updatedChat);
    }
}
export const renameGroupPic = async(req,res,next)=>{
  const { chatId,groupPic} = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(chatId,{
    groupPic:groupPic
      },
                  {
                      new:true,
              
  }).populate("users","-password")
  .populate("groupAdmin","-password");
  if(!updatedChat){
      return next(errorHandler(404,"Chat not found"));
  }else{
      res.status(200).json(updatedChat);
  }
}
export const addToGroup = async(req,res,next)=>{
    const { chatId,userId} = req.body;
    const added = await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId},
    },{
        new:true,
    })
    .populate("users","-password")
    .populate("groupAdmin","-password");
    if(!added){
        return next(errorHandler(404,"Chat not found"));
    }else{
        res.status(200).json(added);
    }
    }
export const removeFromGroup = async(req,res,next)=>{
    const { chatId,userId} = req.body;
    const remove = await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId},
    },{
        new:true,
    })
    .populate("users","-password")
    .populate("groupAdmin","-password");
    if(!remove){
        return next(errorHandler(404,"Chat not found"));
    }else{
        res.status(200).json(remove);
    }
}