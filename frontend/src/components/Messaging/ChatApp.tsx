import { useState, useEffect } from "react"
import io from "socket.io-client"
import YooptaEditor, { createYooptaEditor } from "@yoopta/editor"
import { SlackChat } from "./SlackEditor"
import "./Slack.css" // Assuming you have some CSS for styling specific to SlackChat
import Blockquote from "@yoopta/blockquote"
import Paragraph from "@yoopta/paragraph"
import Image from "@yoopta/image"
import { Bold, Italic, CodeMark, Strike, Underline } from "@yoopta/marks"
import Lists from "@yoopta/lists"
import Link from "@yoopta/link"
import Video from "@yoopta/video"
import File from "@yoopta/file"
import Code from "@yoopta/code"

const plugins = [
  Paragraph.extend({
    options: {
      HTMLAttributes: {
        className: `chatText`,
      },
    },
  }),
  Blockquote.extend({
    options: {
      HTMLAttributes: {
        className: `chatText`,
      },
    },
  }),
  Image,
  Video,
  File,
  Lists.BulletedList.extend({
    options: {
      HTMLAttributes: {
        className: `chatText`,
      },
    },
  }),
  Lists.NumberedList.extend({
    options: {
      HTMLAttributes: {
        className: `chatText`,
      },
    },
  }),
  Link,
  Code,
]

const MARKS = [Bold, Italic, CodeMark, Strike, Underline]

const socket = io("http://localhost:3761")

const ChatApp = ({userId, chatroomId,  username }) => {
  const [messages, setMessages] = useState([])
  const [messageBodies, setMessageBodies] = useState(new Set())

  useEffect(() => {
    if (!chatroomId) {
      console.error("No chatroomId provided")
      return
    }

    // Join the chat room
    socket.emit("joinRoom", chatroomId)

    // Fetch initial messages
    fetch(`http://localhost:3761/api/chatrooms/${chatroomId}/messages`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch messages")
        }
        return response.json()
      })
      .then((data) => {
        const uniqueMessages = []
        const uniqueMessageBodies = new Set()

        data.forEach((message) => {
          if (!uniqueMessageBodies.has(message.body)) {
            uniqueMessages.push(message)
            uniqueMessageBodies.add(message.body)
          }
        })

        setMessages(uniqueMessages.reverse())
        setMessageBodies(uniqueMessageBodies)
        console.log("Fetched messages:", uniqueMessages)
      })
      .catch((error) => console.error("Error fetching messages:", error))

    // Listen for new messages
    const handleMessage = (newMessage) => {
      if (!messageBodies.has(newMessage.body)) {
        setMessages((prevMessages) => [newMessage, ...prevMessages])
        setMessageBodies((prevBodies) =>
          new Set(prevBodies).add(newMessage.body)
        )
      }
    }

    socket.on("message", handleMessage)

    // Clean up
    return () => {
      socket.off("message", handleMessage)
    }
  }, [chatroomId, messageBodies])

  const sendMessage = (messageContent) => {
    if (messageContent.trim()) {
      const newMessage = {
        chatroomId,
        userId,
        body: messageContent,
      }

      console.log("Sending message:", newMessage)

      // Save the message
      fetch(`http://localhost:3761/api/chatrooms/${chatroomId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to send message")
          }
          return response.json()
        })
        .then((data) => {
          console.log("Message sent:", data)
          // Emit the message via socket
          socket.emit("message", data) // Use the full message object returned from the server
        })
        .catch((error) => console.error("Error sending message:", error))
    }
  }

  const renderMessage = (msg, index) => {
    const editor = createYooptaEditor()
    const isUserMessage = msg.user_sent === userId

    return (
      <div
        key={index}
       className=""
      >

          <div className="flex">
          {!isUserMessage && <b className="block mb-2 text-black">{msg.username}:</b>}
       
          </div>
        
        <div  className={`relative gap-3 flex p-4 mb-4 max-w-xs rounded-lg shadow-md ${
          isUserMessage?
           "bg-[#074979] text-black translate-x-[193%] self-end"
           : "bg-[#074979] text-black self-start" 
        }`}>
           {/* {msg.img && !isUserMessage && (
          <img
            src={msg.img}
            alt="user image"
            className="w-10 self-end h-10 rounded-full mb-3"
          />
        )} */}
        <div >

        <YooptaEditor
          editor={editor}
          // @ts-ignore
          plugins={plugins}
          marks={MARKS}
          readOnly
          value={JSON.parse(msg.body)}
          className="editor"
        />
        <div
          className={`absolute top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent ${
            isUserMessage
            ?  "border-l-8 border-[#074979] -right-2"
              : "border-r-8 border-[#074979] -left-2"
             
          }`}
        ></div>

        </div>  

        
        
          </div>
      
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-[4rem] relative  h-[93vh] over w-[88%] overflow-hidden bg-slate-100 bg-opacity-50 border-r backdrop-blur  text-[rgb(218,219,221)]">
      
      <div className="flex-1 overflow-y-auto p-4 mx-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {messages.map((msg, index) => renderMessage(msg, index))}
      </div>
      <div className="p-4  bg-white  bg-opacity-70 backdrop-blur shadow-lg ">
        <SlackChat sendMessage={sendMessage} />
      </div>
    </div>
  )
}

export default ChatApp
