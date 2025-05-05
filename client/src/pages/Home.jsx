import React from "react";
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
export default function Home() {
  return (
    <Container>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        textAlign={"center"}
      >
        <Text fontSize={"1rem"}>Rregister Your Account</Text>
      </Box>
      <Box>
        <Tabs isFitted variant="enclosed" colorScheme="red">
          <TabList  mb="1em">
            <Tab fontWeight={'bold'}>Login</Tab>
            <Tab fontWeight={'bold'}>SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
            <Login/>
            </TabPanel>
            <TabPanel>
            <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}
