import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, position } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useToast } from '@chakra-ui/react'
export default function SignUp() {
    const [show,setShow] = useState(false);
    const [picss,setPic] = useState();
    const [form,setForm] = useState();
    const toast = useToast()
    const [loading,setLoading] = useState(false);
    const submitHandler = async(e)=>{
            e.preventDefault();
            try {
              setLoading(true);
              const res = await fetch('/api/user/signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({...form,pic:picss}),
              });
              const data = await res.json();
              console.log(data);
              if (data.success === false) {
                setLoading(false);
                toast({
                  title: `${data.message}`,
                  status: 'warning',
                  duration: 5000,
                  isClosable: true,
                  position:"bottom"
                });
                return ;
              }
              setLoading(false);
              toast({
               title: `User Signup Successfully`,
               status: 'success',
               duration: 5000,
               isClosable: true,
               position:"bottom"
             });
             
            } catch (error) {
              setLoading(false);
              toast({
               title: `${error.message}`,
               status: 'warning',
               duration: 5000,
               isClosable: true,
               position:"bottom"
             });
            }
         
    }
 const handlechange = (e)=>{
    setForm({...form,[e.target.id]:e.target.value})
 }
 const handleClick = ()=>{
    setShow(!show);
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
         position:"bottom"
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
   <VStack spacing={'20px'}>
     <FormControl id='name' isRequired >
        <FormLabel>
           Username
        </FormLabel>
        <Input placeholder='Enter Your Name' type='text'  onChange={handlechange}
        />
     </FormControl>
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
     <FormControl id='pic' isRequired >
        <FormLabel>
          Upload Your Picture
        </FormLabel>
        <Input placeholder='Enter Your Email' type='file' p={1.5} accept='image/*'  onChange={(e)=>postDetails(e.target.files[0])}
        />
     </FormControl>
     <Button colorScheme='red' width={'100%'} style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>
   SignUp
  </Button>
   </VStack>
  )
}
