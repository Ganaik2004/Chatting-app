import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';
import { allChats } from '../redux/userSlice.js';

export default function GroupChatModal({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupName,setgroupName] = useState();
    const [groupMember,setgroupMember] = useState([]);
    const [picss,setPic] = useState();
    const [loading,setLoading] = useState(false);
    const [search,setSearch] = useState();
    const [searchResult,setSearchResult] = useState();
    const toast  = useToast();
    const {currentUser,allchats} = useSelector((state)=> state.user);
   const dispatch = useDispatch();
  const handleSearch= async(query)=>{
     setSearch(query);
     if(!query){
        toast({
            title: 'Please Enter Something!',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            variant:'subtle',
            position:"top"
          });
          return;
     }
     try{
      setLoading(true);
 const res = await fetch(`/api/user/search?q=${query}`)
 const data = await res.json();
 if(data.success===false){
    setLoading(false)
    toast({
        title: `data.message`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        variant:'subtle',
        position:"top"
      });
 }
 setLoading(false);
 setSearchResult(data);
     }catch(error){
        toast({
            title: `${error.message}`,
            status: 'warning',
            duration: 5000,
            isClosable: true,
            variant:'subtle',
            position:"top"
          });
          return;
     }
  }
  const handleSubmit = async()=>{
     if(!groupName || !groupMember){
        toast({
            title: 'Please Fill All The Fields!',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            variant:'subtle',
            position:"top"
            });
            return;
     }
     try{
        setLoading(true);
        const res = await fetch("/api/chat/group", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({name:groupName,users:JSON.stringify(groupMember.map((u)=>u._id)),pic:picss}),
          })
         const data = await res.json();
         if(data.success===false){
            setLoading(false)
            toast({
                title: `${data.message}`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                variant:'subtle',
                position:"top"
                });
                return;
         }
         setLoading(false)
        dispatch(allChats([data,...allchats]));
        toast({
            title: `New Group Is Formed`,
            status: 'success',
            duration: 5000,
            isClosable: true,
            variant:'subtle',
            position:"top"
            });
            onClose();
         return;
     }catch(error){
        setLoading(false);
        toast({
            title: `${error.message}`,
            status: 'warning',
            duration: 5000,
            isClosable: true,
            variant:'subtle',
            position:"top"
            });
            return;
     }
  }
  const handleDelete = (u)=>{
    setgroupMember(groupMember.filter(sel=>sel._id!==u._id));
  }
  const handleGroup = (user)=>{
    if(groupMember.includes(user)){
        toast({
            title: 'User Already Selected',
            status: 'warning',
            duration: 5000,
            variant:'subtle',
            isClosable: true,
            position:"top"
          });
          return;
    }
    setgroupMember([...groupMember,user]);

  }
  const postDetails = async(pics)=>{
    setLoading(true);
    if(pics===undefined){
       toast({
          title: 'Please Select The Image!',
          status: 'warning',
          duration: 5000,
          variant:'subtle',
          isClosable: true,
          position:"top"
        });
        setLoading(false);
        return ;
    }
    if(pics.type==='image/jpeg'||pics.type==='image/png'||pics.type==='image/jpg'){
       const data = new FormData();
       data.append("file",pics);
       data.append("upload_preset","chatting"),
       data.append("cloud_name","ganaik123");
      await fetch("https://api.cloudinary.com/v1_1/ganaik123/image/upload",{
          method:'post',
          body:data,
       }).then((res)=> res.json()).then(data=>{
          setPic(data.url.toString());
          setLoading(false);
       }).catch((err)=>{
          console.log(err);
          setLoading(false);
       });
       
    }else{
       toast({
          title: 'Please Select The Image!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          variant:'subtle',
          position:"bottom"
        });
        setLoading(false);
        return ;
    }
  }
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent >
          <ModalHeader textAlign={'center'}>New Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDirection={'column'} alignItems={'center'}>
         <FormControl>
            <Input placeholder='Group Name'mb={3} onChange={(e)=>setgroupName(e.target.value)} />
         </FormControl>
        <FormControl id='pic'>
        <FormLabel>
          Upload Group Image
        </FormLabel>
            <Input type='file'  accept='image/*'  mb={3} onChange={(e)=>postDetails(e.target.files[0])} />
            </FormControl>
         <FormControl >
            <Input placeholder='Add User' mb={3} onChange={(e)=>handleSearch(e.target.value)} />
         </FormControl>
         <Box w={"100%"} display={"flex"} flexWrap={"wrap"} gap={"10px"}>

         {groupMember.map(u=>(
            <UserBadgeItem key={u._id} user = {u} handleFunction={()=>handleDelete(u)}/>
         ))}
         </Box>
        {loading?<div>Loading...</div>:(searchResult?.slice(0,10).map(user=>(
            <UserListItem user={user} key={user._id} handleFunction={()=>handleGroup(user)}/>
        )))}

          </ModalBody>

          <ModalFooter>
            <Button isLoading={loading} colorScheme='blue'  onClick={handleSubmit}>
             New Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
