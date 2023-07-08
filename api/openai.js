require("dotenv").config();
const {
  azure_chat_deployment_name,
  azure_chatapi,
} = require("../chatgpt/index");
const chatGroups = require("../models/chatGroups.js");
const roleDescription = `Your name is Veronica, you are an assistant that can help customer using Panda Design. You can tell customers about how to use components in Panda Design`;

async function getChatGroups(req, res) {
  const chatGroupsList = await chatGroups.find();
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
  });
}

async function send_request(req, res, next) {
  const { prompt } = req.body;
  const reqReceivedTime = new Date().toISOString();
  try {
    const conversionInfo = [
      { role: "system", content: roleDescription },
      { role: "user", content: prompt },
    ];
    const completion = await azure_chatapi.getChatCompletions(
      azure_chat_deployment_name,
      conversionInfo
    );
    res.status(200).json({
      result: completion,
      time: reqReceivedTime,
    });
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
module.exports = { send_request, getChatGroups, addChatGroups };
