import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import MyChats from '../components/MyChats';
import SideDrawer from '../components/SideDrawer';
import ChatBox from '../components/ChatBox';
import { Box } from '@chakra-ui/react';
export default function ChatPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [fetchAgain,setfetchAgain] = useState(false);
 
  return (
  <div style={{width:"100%"}}>
    {currentUser && <SideDrawer/>}
    <Box display={"flex"}
    justifyContent={'space-between'}
    w={'100%'}
    h={'93vh'}
    padding={'10px'}>
      {currentUser && <MyChats fetchAgain = {fetchAgain}/>}
      {currentUser && <ChatBox fetchAgain = {fetchAgain} setfetchAgain = {setfetchAgain}/>}
    </Box>
  </div>
  )
}
