var express = require("express");
var Task = require("../models/task");

var router = express.Router();
const {
  send_request,
  getChatGroups,
  addChatGroups,
  deleteChatGroups,
} = require("../api/openai");

router.post("/api/send_request", send_request);
router.get("/api/get_chat_groups", getChatGroups);
router.post("/api/add_chat_groups", addChatGroups);
router.post("/api/delete_chat_groups", deleteChatGroups);
module.exports = router;
