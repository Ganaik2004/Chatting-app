import { Box } from '@chakra-ui/react';
import React from 'react'
import { useSelector } from 'react-redux'
import SingleChat from './SingleChat';

export default function ChatBox({fetchAgain,setfetchAgain}) {
  const {setSelectedChat} = useSelector((state)=>state.user);

  return (
   <Box display={{base:setSelectedChat?"flex":"none",md:"flex"}}
   alignItems={"center"}
   flexDirection={"column"}
   p={3}
   bg={"white"}
   w={{base:"100%",md:"68%"}}
   borderRadius={"lg"}
   borderWidth={"1px"}
   >
 <SingleChat fetchAgain = {fetchAgain} setfetchAgain = {setfetchAgain}/>
   </Box>
  )
}
