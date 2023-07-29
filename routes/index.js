var express = require("express");

var router = express.Router();
const {
  send_request,
  getChatGroups,
  addChatGroups,
  deleteChatGroups,
} = require("../api/openai");
const {
  generateComponentEmbeddings,
  generateEmbeddings,
} = require("../api/embedding");

const {createPrompt} = require("../api/promptCreator")

router.post("/api/send_request", send_request);
router.get("/api/get_chat_groups", getChatGroups);
router.post("/api/add_chat_groups", addChatGroups);
router.post("/api/delete_chat_groups", deleteChatGroups);
router.post("/api/generate_embeddings", generateEmbeddings);
router.post("/api/generate_component_embeddings", generateComponentEmbeddings);
router.post("/api/create_prompt",createPrompt)
module.exports = router;
