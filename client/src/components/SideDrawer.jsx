import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,

  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChevronDownIcon, SearchIcon, BellIcon, Search2Icon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";
import { useToast } from "@chakra-ui/react";
import {  Badge, Space } from 'antd';
// import Badge from '@mui/material/Badge';
// import MailIcon from '@mui/icons-material/Mail';
import {
  allChats,
  deleteUserFailure,
  deleteUserSuccess,
  setChat,
  signOutStart,
  setnotification
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { getSender } from "../assets/ChatLogics.js";
export default function SideDrawer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { currentUser,allchats,notification } = useSelector((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/user/signout");
      const data = await res.json();
      if (data.success === false) {
        toast({
          title: `${data.message}`,
          status: "warning",
          duration: 5000,
          variant: "subtle",
          isClosable: true,
          position: "top",
        });
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast({
        title: `User Logout Successfully`,
        status: "success",
        duration: 5000,
        variant: "subtle",
        isClosable: true,
        position: "top",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: `${error.message}`,
        status: "warning",
        duration: 5000,
        variant: "subtle",
        isClosable: true,
        position: "top",
      });
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleClick = async()=>{
    if(!search){
      toast({
        title: `Please Enter Something in search`,
        status: "warning",
        duration: 5000,
        variant: "subtle",
        isClosable: true,
        position: "top",
      });
      return ;
    }
    try{
      setLoading(true)
      const res = await fetch(`/api/user/search/?q=${search}`)
      const data =await res.json();
      if(data.success===false){
        setLoading(false)
        toast({
          title: `${data.message}`,
          status: "warning",
          duration: 5000,
          variant: "subtle",
          isClosable: true,
          position: "top",
        });
        return;
      }
      setLoading(false)
      setSearchResult(data)
      return;
    }catch(error){
     setLoading(false)
     toast({
      title: `${error.message}`,
      status: "warning",
      duration: 5000,
      variant: "subtle",
      isClosable: true,
      position: "top",
    });
    }
   
  }
  const accessChat = async(userId)=>{
    console.log(userId)
    try{
       setLoadingChat(true)
       const res = await fetch('/api/chat/acc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({userId}),
      });
      const data = await res.json();
       if(data.success===false){
        setLoadingChat(false);
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
       if(!allchats.find((c)=>c._id===data._id)) dispatch(allChats([data,...allchats]));
       setLoadingChat(false)
       dispatch(setChat(data));
       onClose();
    }catch(err){
      setLoadingChat(false)
      toast({
        title: `${err.message}`,
        status: "warning",
        duration: 5000,
        variant: "subtle",
        isClosable: true,
        position: "top",
      });
      return ;
    }
  }
  console.log(notification)
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            onClick={onOpen}
            leftIcon={<SearchIcon fontSize={"15px"} />}
          >
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} display={{ base: "none", md: "flex" }}>
        24HCHAT
        </Text>
        <div>
          <Menu>
            <MenuButton mx={4}>
      <Badge count={notification.length} size="small" color="green" className="text-green-700">
              <BellIcon fontSize={"2xl"} ></BellIcon>
              </Badge>
            </MenuButton>
            <MenuList  textAlign={"center"}>
              {!notification.length && "No New Messages"}
              {notification.map(noti=>(
                <MenuItem  key={noti._id} onClick={
                  ()=>{
                    dispatch(setChat(noti.chat))
                    dispatch(setnotification(notification.filter((n)=> n!==noti)))
                  }
                } >
{noti.chat.isGroupChat?<span className="font-bold text-green-400">{noti.chat.chatName}</span>:<span className="font-bold text-green-400">{getSender(currentUser,noti.chat.users).name} : {noti.content}</span>}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg={"white"}
            >
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={currentUser.name}
                src={currentUser.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={currentUser}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuItem onClick={handleSignOut}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={'1px'}>Search Users</DrawerHeader>
          <DrawerBody>
          <Box display={'flex'} paddingBottom={2}>
            <Input placeholder="Search by name or email" mr={2} value={search} onChange={(e)=>setSearch(e.target.value)}>

            </Input>
            <Button onClick={handleClick}><Search2Icon></Search2Icon></Button>
          </Box>
          {   
           loading?(<ChatLoading/>):
           searchResult?.map(user=>(
           <UserListItem 
           key={user._id} 
       user={user} 
       handleFunction = {()=>accessChat(user._id)}/>
     ))
        
      }
      {loadingChat && <Spinner ml="auto" display={'flex'}/>}
        </DrawerBody>
        <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
        

        
        
      </Drawer>
    </>
  );
}
