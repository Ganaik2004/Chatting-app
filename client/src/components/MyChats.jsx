import { Avatar, Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { allChats, setChat } from '../redux/userSlice';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../assets/ChatLogics';
import GroupChatModal from './GroupChatModal';

export default function MyChats({fetchAgain}) {
  // const [loggedUser,setLoggedUser] = useState();
  const style1={
    fontSize:"12px",
    fontWeight:"bold",
    marginRight:"3px"
  }
  const {currentUser,allchats, setSelectedChat} = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const toast = useToast();
  const fatchChats = async ()=>{
    try{
      const res = await fetch('/api/chat/a');
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
        dispatch(allChats(data));
    }catch(err){
      toast({
        title: `${err.message}`,
        status: 'warning',
        duration: 5000,
        variant:'subtle',
        isClosable: true,
        position:"bottom"
      });
      return ;
    }
  }
  useEffect(()=>{
    fatchChats();
  },[fetchAgain])
  return (
   <Box  font display={{base:setSelectedChat?"none":"flex",md:"flex"}}
   flexDirection={"column"}
   alignItems={"center"}
   p={3}
   bg={"white"}
   w={{base:"100%",md:"31%"}}
   borderRadius={"lg"}
   borderWidth={"1px"}>
    <Box pb={3}
    px={3}
    fontSize={{base:"28px",md:"30px"}}
    display={"flex"}
    w={"100%"}
    justifyContent={"space-between"}
    alignItems={"center"}>
      My Chats
      <GroupChatModal>
      <Button display={"flex"} fontSize={{base:"17px",md:"10px",lg:"17px"}} rightIcon={<AddIcon/>}>New Group Chat</Button>
      </GroupChatModal>
    </Box>
    <Box display={"flex"}
    flexDirection={"column"}
    p={3}
    bg={"#F8F8F8"}
    w="100%"
    h="100%"
    borderRadius={"lg"}
    overflowY={"hidden"}>
     {allchats?(<Stack overflowY='scroll'>
      {allchats.map((chat)=>(
        
          <Box onClick={()=>dispatch(setChat(chat))} cursor={'pointer'}
          bg={setSelectedChat===chat?"#38B2AC":"#E8E8E8"}
          color={setSelectedChat===chat?"white":"black"}
          px={3}
          py={2}
          borderRadius={"lg"}
          key={chat._id}
          w="100%"
          display="flex"
          alignItems="center"
          mb={2}>
            <Avatar
        mr={2}
        size={"sm"}
        cursor={"pointer"}
        name={!chat.isGroupChat?getSender(currentUser,chat.users).name:chat.chatName}
        src={!chat.isGroupChat?getSender(currentUser,chat.users).pic:chat.groupPic}
      ></Avatar>
      <Box display={"flex"}
      flexDirection={"column"}
      >
 <Text >{!chat.isGroupChat?getSender(currentUser,chat.users).name:chat.chatName}</Text>
      <Text fontSize={"10px"}>{!chat.latestMessage?<div>Start The Chat</div>:<div><span style={style1}>{chat.isGroupChat?chat.latestMessage.sender.name==currentUser.name?`${chat.latestMessage.content}`:`${chat.latestMessage.sender.name} : ${chat.latestMessage.content}`:chat.latestMessage.content}</span></div>}</Text>

     
      </Box>
            
          </Box>
       
      ))}
     </Stack>):<ChatLoading/>}
    </Box>
   </Box>
  )
}
