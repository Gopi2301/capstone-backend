import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js"
import users from "../models/users.js";
import chatmodel from "../models/chatmodel.js";

export const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request")
        return res.sendStatus(400)
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }
    try {
        var message = await Message.create(newMessage)
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await users.populate(message, {
            path: 'chat.users',
            select: 'name pic email'
        })
        await chatmodel.findByIdAndUpdate(req.body.chatId, {
            lastestMessage: message,
        })
        res.json(message)
    } catch (error) {
        res.status(400).json(error.message)
    }
})
export const allMessage = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate('chat')
        res.json(messages)
    } catch (error) {
        res.status(400).json(error)
    }
})