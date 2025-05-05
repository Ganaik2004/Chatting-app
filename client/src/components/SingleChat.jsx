import { ArrowBackIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Center, FormControl, IconButton, Input, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChat, setnotification } from "../redux/userSlice.js";
import { getSender } from "../assets/ChatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupModal from "./UpdateGroupModal";
import "./Style.css"
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client'
import animationData from "../animation/typing.json"
const ENDPOINT = "http://localhost:3000"
let socket,selectedChatCompare;
import Lottie from "react-lottie"
export default function SingleChat({ fetchAgain, setfetchAgain }) {
  const [message,setMessage] = useState([]);
  const [loading,setLoading] = useState(false);
  const [newMessage,setNewMessage] = useState();
  const [typing,setTyping] = useState(false);
  const [istyping,setIsTyping] = useState(false);
  const [socketConnected,setSocketConnected] = useState(false);
  const { currentUser, setSelectedChat, notification } = useSelector((state) => state.user);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  
  const dispatch = useDispatch();
  const fetchMessages = async()=>{
    if(!setSelectedChat) return;
    try {
    setLoading(true);
       const res = await fetch(`/api/message/${setSelectedChat._id}`);
       const data = await res.json();
       if (data.success === false) {
        setLoading(false)
         toast({
           title: `${data.message}`,
           status: 'warning',
           duration: 5000,
           variant:'subtle',
           isClosable: true,
           position:"bottom"
         });
         return ;
       }

 setLoading(false);
 setMessage(data);
socket.emit("join chat",setSelectedChat._id)
     } catch (error) {
      setLoading(false)
       toast({
        title: `${error.message}`,
        status: 'warning',
        duration: 5000,
        variant:'subtle',
        isClosable: true,
        position:"bottom"
      });
     }
} 
const sendMessage = async(e)=>{
  if(e.key==="Enter" && newMessage){
    socket.emit("stop typing",setSelectedChat._id)
    try {
      setNewMessage("");
       const res = await fetch('/api/message', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({content:newMessage,chatId:setSelectedChat._id}),
       });
       const data = await res.json();
       if (data.success === false) {
         toast({
           title: `${data.message}`,
           status: 'warning',
           duration: 5000,
           variant:'subtle',
           isClosable: true,
           position:"bottom"
         });
         return ;
       }
socket.emit("new message",data)
    setMessage([...message,data]);
     } catch (error) {
       toast({
        title: `${error.message}`,
        status: 'warning',
        duration: 5000,
        variant:'subtle',
        isClosable: true,
        position:"bottom"
      });
     }
}
} 
  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit("setup",currentUser)
    socket.on("connected",()=>{setSocketConnected(true)})
    socket.on('typing',()=>setIsTyping(true))
    socket.on('stop typing',()=>setIsTyping(false))
   },[])
 
   useEffect(()=>{
    fetchMessages();
    selectedChatCompare = setSelectedChat;
      },[setSelectedChat])
      useEffect(()=>{
        socket.on("message recieved",(newMessageRecieved)=>{
          if(!selectedChatCompare || selectedChatCompare._id!==newMessageRecieved.chat._id){
               if(!notification.includes(newMessageRecieved)){
                console.log("i am here")
                dispatch(setnotification([newMessageRecieved,...notification]))
                setfetchAgain(!fetchAgain);
               }
          }else{
            // dispatch(setnotification([]))
            setMessage([...message,newMessageRecieved])
           
          }
        })
      })
  const typingHandler= (e)=>{
  setNewMessage(e.target.value);
  if(!socketConnected) return ;
  if(!typing){
    setTyping(true)
    socket.emit("typing",setSelectedChat._id)
  }
  let lastTypingTime = new Date().getTime();
  let timeLength = 3000
  setTimeout(() => {
    let timeNow = new Date().getTime();
    let timeDiff= timeNow-lastTypingTime;
    if(timeDiff >= timeLength && typing){
      socket.emit("stop typing",setSelectedChat._id)
      setTyping(false)
      }
  },timeLength)
}
  return (
    <>
      {setSelectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            w={"100%"}
            mb={3}
            display={"flex"}
            justifyContent={"left"}
            alignItems={"center"}
            gap={"5px"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              bg={"white"}
              _active={"white"}
              icon={<ArrowBackIcon fontSize={"20px"} />}
              onClick={() => dispatch(setChat(null))}
            ></IconButton>
            {!setSelectedChat.isGroupChat ? (
              <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              flexGrow={1}>
              {
                  <Box display={"flex"} alignItems={"center"} gap={"2"}>
                    <Avatar
                      size={'sm'}
                      cursor={"pointer"}
                      name={getSender(currentUser,setSelectedChat.users).name}
                      src={getSender(currentUser,setSelectedChat.users).pic}
                    ></Avatar>
                    <Text fontSize={'20px'}>{getSender(currentUser,setSelectedChat.users).name}</Text>
                  </Box>
                }
                {
                    <ProfileModal user={getSender(currentUser,setSelectedChat.users)}>

                    </ProfileModal>
                }
              </Box>
            ) : (
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                flexGrow={1}
              >
                {
                  <Box display={"flex"} alignItems={"center"} gap={"2"}>
                    <Avatar
                      size={'sm'}
                      cursor={"pointer"}
                      name={setSelectedChat.chatName.toUpperCase()}
                      src={setSelectedChat.groupPic}
                    ></Avatar>
                    <Text fontSize={'20px'}>{setSelectedChat.chatName.toUpperCase()}</Text>
                  </Box>
                }
               {
<UpdateGroupModal fetchAgain = {fetchAgain} setfetchAgain = {setfetchAgain} fetchMessages={fetchMessages}/>
               }
              </Box>
            )}
          </Text>
          <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"flex-end"}
          p={3}
          bg={"#E8E8E8"}
          w={"100%"}
          h={"100%"}
          borderRadius={"lg"}
          overflowY={"hidden"}>
           {loading?<Spinner size={'xl'}  w={20} h={20} alignSelf={"center"} margin={"auto"}/>:(<div className="messages">
            <ScrollableChat messages={message}/>
           </div>)}
         
         <FormControl onKeyDown={sendMessage} mt={3} isRequired >
         {istyping?<div><Lottie options={defaultOptions} width={70} style={{marginBottom:15,marginLeft:0}}/></div>:<></>}
           <Input variant={"filled"} mt={5} bg={"#E0E0E0"} placeholder="Enter a message.." onChange={typingHandler} value={newMessage} />
           {/* <Button  id="send" onClick={sendMessage} ml={3} colorScheme="teal" ><ArrowRightIcon /></Button> */}
           </FormControl>
         
  
          
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"}>Click on a user to start chatting</Text>
        </Box>
      )}
    </>
  );
}
