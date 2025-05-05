import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMEssage, isSameMessage, isSameSenderMargin, isSameUser } from '../assets/ChatLogics.js'
import { useSelector } from 'react-redux'
import { Avatar, Tooltip } from '@chakra-ui/react';
export default function ScrollableChat({messages}) {
    const {currentUser}  = useSelector((state)=>state.user);
  return (
    <ScrollableFeed>{
        messages&& messages.map((m,i)=>(
            <div style={{display:"flex"}} key={m._id}>
                {
                    ((isSameMessage(messages,m,i,currentUser._id))||isLastMEssage(messages,i,currentUser._id)) &&(
                        <Tooltip
                        label={m.sender.name}
                        placement='bottom-start'
                        hasArrow
                        >
     <Avatar mt={'7px'}
     mr={1}
     size={"sm"}
     cursor={"pointer"}
     name={m.sender.name}
     src={m.sender.pic}/>
                        </Tooltip>
                    )
                }
                <span
                style={{backgroundColor:`${m.sender._id===currentUser._id?"#BEE3F8":"#B9F5D0"}`,borderRadius:"10px",
                padding:"5px 15px",
                maxWidth:"75%",
                marginLeft:isSameSenderMargin(messages,m,i,currentUser._id),
                marginTop:isSameUser(messages,m,i,currentUser._id)?3:10,
                }}>
{m.content}
                </span>
            </div>
        ))}

    </ScrollableFeed>
  )
}
