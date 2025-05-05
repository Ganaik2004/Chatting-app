import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

export default function ProfileModal({user,children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
    {children?(<span onClick={onOpen}>{children}</span>):(
        <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
    )}
      <Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h={"410px"}>
          <ModalHeader display={'flex'} justifyContent={'center'}>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} justifyContent={'space-around'} alignItems={'center'} flexDirection={'column'}>
          <Image borderRadius={'full'}
          boxSize={'200px'}
          src={user.pic}
          alt={user.name}/>
          <Text fontSize={{base:"18px",md:"20px"}}>
            Email:{user.email}
          </Text>
          </ModalBody>

          <ModalFooter >
            <Button width={"100%"} colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
       
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

