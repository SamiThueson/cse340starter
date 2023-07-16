// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const messController = require("../controllers/messageController")
const regValidate = require("../utilities/message-validation")

// Route for building message management view
router.get("/", utilities.checkLogin, utilities.handleErrors(messController.buildMessageInbox));

// Route for building a new message and add the new message
router.get("/new-message", utilities.checkLogin, utilities.handleErrors(messController.buildNewMessage));
router.post("/new-message",
  regValidate.messageRules(),
  regValidate.checkNewMessageData,
  utilities.handleErrors(messController.addNewMessage)
);

// Route for building viewing archived messages
router.get("/archived", utilities.checkLogin, utilities.handleErrors(messController.buildArchivedMessage));

// Route for building viewing archived messages
router.get("/show-message/:message_id", utilities.checkLogin, utilities.handleErrors(messController.buildByMessageId));

// Route for building reply message
router.get("/reply/:message_id", utilities.checkLogin, utilities.handleErrors(messController.buildReplyMessage));
router.post("/reply",
  regValidate.messageRules(),
  regValidate.checkReplyMessageData,
  utilities.handleErrors(messController.addNewMessage)
);

// Route for marking a message as read
router.post("/mark-read/:message_id", utilities.handleErrors(messController.markMessageRead));

// Route for archiving a message
router.post("/mark-archived/:message_id", utilities.handleErrors(messController.markMessageArchived));

// Route for deleting a message
router.post("/delete/:message_id", utilities.handleErrors(messController.deleteMessage));


module.exports = router;