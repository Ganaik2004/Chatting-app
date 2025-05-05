import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

export default function UserBadgeItem({user,handleFunction}) {
  return (
   <Box
   px={2}
   py={1}
   borderRadius={"lg"}
   onClick={handleFunction}
   cursor={'pointer'}
   m={1}
   mb={2}
   variant={"solid"}
   fontSize={12}
   bg="#FEB941"
   color={'white'}
   >
    {user.name}
    <CloseIcon pl={2} width={'1rem'}/>
   </Box>
  )
}
