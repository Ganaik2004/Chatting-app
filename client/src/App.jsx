import {BrowserRouter,Routes,Route, useNavigate} from "react-router-dom"
import React, { useEffect } from 'react'
import Home from "./pages/Home"
import ChatPage from "./pages/ChatPage"
import "./App.css"
import { useDispatch, useSelector } from "react-redux";
import { deleteUserFailure, deleteUserSuccess, signOutStart } from "./redux/userSlice.js"
import { useToast } from "@chakra-ui/react"
import PrivateRoute from "./components/PrivateRoute"
export default function App() {
  // const dispatch = useDispatch();
 
  // const toast = useToast();
 
  // const handleSignOut = async () => {
  //   try {
  //     dispatch(signOutStart());
  //     const res = await fetch("/api/user/signout");
  //     const data = await res.json();
  //     if (data.success === false) {
  //       toast({
  //         title: `${data.message}`,
  //         status: "warning",
  //         duration: 5000,
  //         variant: "subtle",
  //         isClosable: true,
  //         position: "top",
  //       });
  //       dispatch(deleteUserFailure(data.message));
  //       return;
  //     }
  //     dispatch(deleteUserSuccess(data));
  //     toast({
  //       title: `User Logout Successfully`,
  //       status: "success",
  //       duration: 5000,
  //       variant: "subtle",
  //       isClosable: true,
  //       position: "top",
  //     });

  //   } catch (error) {
  //     toast({
  //       title: `${error.message}`,
  //       status: "warning",
  //       duration: 5000,
  //       variant: "subtle",
  //       isClosable: true,
  //       position: "top",
  //     });
  //     dispatch(deleteUserFailure(error.message));
  //   }
  // };
  // useEffect(() => {
  //   window.onbeforeunload = function() {
  //     handleSignOut();
  //   }
  // }, []);
  return (
    <BrowserRouter>
     <Routes>
       <Route path="/" element={<Home/>}/>
       <Route element ={<PrivateRoute/>}>
       <Route path="/chatpage" element={<ChatPage/>}/>
       </Route>
     </Routes>
     </BrowserRouter>
  )
}
