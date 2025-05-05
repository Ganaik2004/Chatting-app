import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, FormLabel, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import UserBadgeItem from './UserBadgeItem';
import { setChat } from '../redux/userSlice.js';
import UserListItem from './UserListItem.jsx';

export default function UpdateGroupModal({ fetchAgain, setfetchAgain,fetchMessages }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const [groupName,setgroupName] = useState();
    const [groupMember,setgroupMember] = useState([]);
    const [picss,setPic] = useState();
    const [loading,setLoading] = useState(false);
    const [loading1,setLoading1] = useState(false);
    const [loading2,setLoading2] = useState(false);
    const [search,setSearch] = useState();
    const [searchResult,setSearchResult] = useState();
    const toast  = useToast();
    const {currentUser, setSelectedChat}  = useSelector((state)=>state.user);
    const handleRemove =async (u)=>{
             if(setSelectedChat.groupAdmin._id!==currentUser._id && u._id!==currentUser._id){
                toast({
                    title: 'Only group admin can remove a member',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    variant:'subtle',
                    position: 'top'
                    });
                return;
             }
             try{
                setLoading(true);
            const res = await fetch("/api/chat/groupremove", {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({chatId:setSelectedChat._id,userId:u._id}),
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
             u._id===currentUser._id?dispatch(setChat(null)):dispatch(setChat(data));
             setLoading(false)
             setfetchAgain(!fetchAgain);
             fetchMessages();
             return;
             }catch(error){
                toast({
                    title:`${error.message}`,
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    variant:'subtle',
                    position: 'top'
                    });
                    return;
             }
    }
    const postDetails = async(pics)=>{
        setLoading2(true);
        if(pics===undefined){
           toast({
              title: 'Please Select The Image!',
              status: 'warning',
              duration: 5000,
              variant:'subtle',
              isClosable: true,
              position:"top"
            });
            setLoading2(false);
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
              setLoading2(false);
           }).catch((err)=>{
              console.log(err);
              setLoading2(false);
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
            setLoading2(false);
            return ;
        }
      }
    const handleUpdateName = async(e)=>{
      if(!groupName){
        toast({
            title: 'Please Fill All the Feilds!',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            variant:'subtle',
            position:"top"
            });
            return;
      }
      try{
 setLoading1(true);
 const res = await fetch('/api/chat/renamegroup',{
    method:'put',
    headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chatId:setSelectedChat._id,
            chatName:groupName,
            })

 })
 const data =await res.json();
 if(data.success===false){
    toast({
        title: `${data.message}`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        variant:'subtle',
        position:"top"
        });
        setLoading1(false);
        return ;
 }
 await setfetchAgain(!fetchAgain);
 dispatch(setChat(data))
 setLoading1(false);
      }catch(error){
        setLoading1(false);
        toast({
            title: `${error.message}`,
            status: 'error',
            duration: 5000,
            isClosable: true,
            variant:'subtle',
            position:"bottom"
            });
            return;
      }
      setgroupName("");
    }
    const handleUpdatePic = async()=>{
        console.log(picss)
        if(!picss){
            toast({
                title: 'Please Fill All the Feilds!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                variant:'subtle',
                position:"bottom"
                });
                return;
          }
          try{
     setLoading2(true);
     const res = await fetch('/api/chat/renamegroupPic',{
        method:'put',
        headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chatId:setSelectedChat._id,
                groupPic:picss,
                })
    
     })
     const data =await res.json();
     if(data.success===false){
        toast({
            title: `${data.message}`,
            status: 'warning',
            duration: 5000,
            isClosable: true,
            variant:'subtle',
            position:"top"
            });
            setLoading2(false);
            return ;
     }
      setfetchAgain(!fetchAgain);
     dispatch(setChat(data))
     setLoading2(false);
     setPic(null)
          }catch(error){
            setLoading2(false);
            toast({
                title: `${error.message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
                variant:'subtle',
                position:"bottom"
                });
                return;
          }
         
    }
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
     const handleGroup =async (user)=>{
        if(setSelectedChat.users.find((u)=>u._id===user._id)){
            toast({
                title: 'User Already Added In The Group',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                variant:'subtle',
                position:"top"
            })
            return;
        }
        if(setSelectedChat.groupAdmin._id!==currentUser._id){
            toast({
                title: 'You Are Not The Group Admin',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                variant:'subtle',
                position:"top"
                })
                return;
        }
        try{
            setLoading(true);
            const res = await fetch("/api/chat/groupadd", {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({chatId:setSelectedChat._id,userId:user._id}),
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
              setfetchAgain(!fetchAgain);
             dispatch(setChat(data))
            toast({
                title: `${user.name} is Added To The Group`,
                status: 'success',
                duration: 5000,
                isClosable: true,
                variant:'subtle',
                position:"top"
                });
             return;
    
        }catch(error){
          setLoading(false)
            toast({
                title: `${error.message}`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                variant:'subtle',
                position:"top"
                })
                return;
        }
    
      }
  return (
    <>
    <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={'center'}>{setSelectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
         <Box w={'100%'} display={'flex'} flexWrap={'wrap'} gap={'5px'}>
     {setSelectedChat.users.map((u)=>(
         <UserBadgeItem key={u._id} user = {u} handleFunction={()=>handleRemove(u)}/>
     ))}
         </Box>
         <FormControl display={'flex'}>
            <Input placeholder='Group Name'mb={3} value={groupName} onChange={(e)=>setgroupName(e.target.value)} />
           
           
            <Button colorScheme='teal' ml={3} isLoading={loading1} onClick={handleUpdateName}>
          Update
         </Button>
         </FormControl>
         <FormControl id='pic' display={"flex"}>
      
            <Input type='file'  accept='image/*'  mb={3} onChange={(e)=>postDetails(e.target.files[0])} />
            <Button colorScheme='teal' ml={3} isLoading={loading2} onClick={handleUpdatePic}>
          Update Pic
         </Button>
            </FormControl>
     
         <FormControl >
            <Input placeholder='Add User' mb={3} onChange={(e)=>handleSearch(e.target.value)} />
         </FormControl>
         {loading?<div>Loading...</div>:(searchResult?.slice(0,10).map(user=>(
            <UserListItem user={user} key={user._id} handleFunction={()=>handleGroup(user)}/>
        )))}
        
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red'  onClick={()=>handleRemove(currentUser)} isLoading={loading}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
