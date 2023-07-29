require("dotenv").config();
const {
  azure_chat_deployment_name,
  azure_chatapi,
} = require("../chatgpt/index");
const chatGroups = require("../models/chatGroups.js");
const {
  roleMap,
  assistantLabel,
  userLabel,
  roleDescriptionMap
} = require("../utils/constants");

async function getChatGroups(req, res) {
  const { id } = req.query;
  let chatGroupsList;
  if (!id) {
    chatGroupsList = await chatGroups.find();
  } else {
    chatGroupsList = await chatGroups.findById(id);
  }
  res.json({
    success: true,
    res: chatGroupsList,
  });
}
async function addChatGroups(req, res) {
  const { chatGroupTitle } = req.body;
  let newChatGroups = new chatGroups({ chatGroupTitle });
  await newChatGroups.save();
  res.json({
    success: true,
    res: newChatGroups,
  });
}

async function deleteChatGroups(req, res) {
  const { id } = req.body;
  await chatGroups.findByIdAndDelete(id);
  res.json({
    success: true,
  });
}

async function send_request(req, res) {
  const { prompt, is_init, chatGroupId } = req.body;
  const roleDescription = roleDescriptionMap['1'];
  const conversionInfoInit = [
    { role: roleMap.system, content: roleDescription },
    { role: roleMap.user, content: "hello" },
  ];
  const currentChatGroup = await chatGroups.findById(chatGroupId);
  try {
    if (is_init) {
      currentChatGroup.chatMessages.push({
        role: roleMap.system,
        message: roleDescription,
        createAt: new Date(),
        userName: assistantLabel,
        reverse: false,
      });
      const completion = await azure_chatapi.getChatCompletions(
        azure_chat_deployment_name,
        conversionInfoInit
      );
      currentChatGroup.chatMessages.push({
        role: roleMap.assistant,
        message: completion?.choices?.[0].message.content,
        createAt: new Date(),
        userName: assistantLabel,
        reverse: true,
      });
      await currentChatGroup.save();
      res.status(200).json({
        success: true,
        result: completion,
      });
    } else {
      const newMessage = {
        role: roleMap.user,
        content: prompt,
      };
      const newMessageToDatabase = {
        role: roleMap.user,
        message: prompt,
        createAt: new Date(),
        userName: userLabel,
        reverse: false,
      };
      const conversionInfo = currentChatGroup.chatMessages.map((chat) => {
        return {
          role: chat.role,
          content: chat.message,
        };
      });
      conversionInfo.push(newMessage);
      currentChatGroup.chatMessages.push(newMessageToDatabase);
      await currentChatGroup.save();
      const completion = await azure_chatapi.getChatCompletions(
        azure_chat_deployment_name,
        conversionInfo
      );
      const newReplyToDatabase = {
        role: roleMap.assistant,
        message: completion?.choices?.[0].message.content,
        createAt: new Date(completion.created),
        userName: assistantLabel,
        reverse: true,
      };
      currentChatGroup.chatMessages.push(newReplyToDatabase);
      await currentChatGroup.save();
      res.status(200).json({
        success: true,
        sentMessages: conversionInfo,
      });
    }
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
module.exports = {
  send_request,
  getChatGroups,
  addChatGroups,
  deleteChatGroups,
};
