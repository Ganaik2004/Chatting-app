import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/userSlice.js'
export default function Login() {
    const [show,setShow] = useState(false);
    const [form,setForm] = useState();
    const toast = useToast();
    const navigate = useNavigate();
   const {loading,error} = useSelector((state)=>state.user);
    const dispatch = useDispatch();
 const handlechange = (e)=>{
   setForm({...form,[e.target.id]:e.target.value})
 }
 const submitHandler = async(e)=>{
   e.preventDefault();
   try {
    dispatch(signInStart());
     const res = await fetch('/api/user/login', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(form),
     });
     const data = await res.json();
     if (data.success === false) {
     dispatch(signInFailure(data.message));
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
    dispatch(signInSuccess(data));
     toast({
      title: `User Login Successfully`,
      status: 'success',
      duration: 5000,
      variant:'subtle',
      isClosable: true,
      position:"bottom"
    });
    navigate("/chatpage");
   } catch (error) {
  dispatch(signInFailure(error.message));
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
 const handleClick = ()=>{
    setShow(!show);
 }
  return (
   <VStack spacing={'20px'}>
     <FormControl id='email' isRequired >
        <FormLabel>
           Email
        </FormLabel>
        <Input placeholder='Enter Your Email' type='email'  onChange={handlechange}
        />
     </FormControl>
     <FormControl id='password' isRequired >
        <FormLabel>
           Password
        </FormLabel>
        <InputGroup>
        <Input placeholder='Enter Your Password' type={show?"text":"password"} onChange={handlechange} />
        <InputRightElement width={'4.5rem'}>
        <Button h='1.75rem' size='sm' bg={'white'} _hover={"white"} _active={"white"} onClick={handleClick}>
             {show?<ViewOffIcon w={6} h={6}/>:<ViewIcon w={6} h={6}/>}
            </Button>
        </InputRightElement>
        </InputGroup>   
     </FormControl>
     <Button colorScheme='red' width={'100%'} onClick={submitHandler} isLoading = {loading}>
   Login
  </Button>
   </VStack>
  )
}
