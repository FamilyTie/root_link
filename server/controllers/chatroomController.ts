import { Request, Response } from "express"
import { Chatrooms } from "../db/models/ChatRooms"

export const createChatroom = async (req: Request, res: Response) => {
  const { user1_id, user2_id } = req.body

  try {
    const existingChatroom = await Chatrooms.findChatRoom(user1_id, user2_id)
    if (existingChatroom) {
      return res.status(200).json(existingChatroom)
    }

    const newChatroom = await Chatrooms.createChatRoom(user1_id, user2_id)
    res.status(201).json(newChatroom)
  } catch (error) {
    console.error("Failed to create chatroom:", error)
    res
      .status(500)
      .json({ message: "Failed to create chatroom", error: error.toString() })
  }
}

export const deleteChatroom = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const deletedChatroom = await Chatrooms.deleteChatroom(Number(id))
    if (deletedChatroom) {
      res
        .status(200)
        .json({ message: "Chatroom deleted", chatroom: deletedChatroom })
    } else {
      res.status(404).json({ message: "Chatroom not found" })
    }
  } catch (error) {
    console.error("Failed to delete chatroom:", error)
    res
      .status(500)
      .json({ message: "Failed to delete chatroom", error: error.toString() })
  }
}

export const getMessages = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const messages = await Chatrooms.getMessages(Number(id))
    res.status(200).json(messages)
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    res
      .status(500)
      .json({ message: "Failed to fetch messages", error: error.toString() })
  }
}

export const addMessage = async (req: Request, res: Response) => {
  const { id } = req.params // Extract id from URL parameters
  const { userId, body } = req.body
  console.log("controller id:", id) // Log to verify id is extracted correctly
  console.log("controller userId:", userId)
  console.log("controller body:", body)

  if (!id) {
    console.log("Invalid chatroom ID:", id)
    return res.status(400).json({ message: "Invalid chatroom ID" })
  }

  try {
    const message = await Chatrooms.addMessage(Number(id), userId, body)
    res.status(201).json(message)
  } catch (error) {
    console.error("Failed to add message:", error)
    res
      .status(500)
      .json({ message: "Failed to add message", error: error.toString() })
  }
}