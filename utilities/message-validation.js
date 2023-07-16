const utilities = require(".")
const invModel = require("../models/inventory_model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Message Data Validation Rules
 * ********************************* */
validate.messageRules = () => {
  return [
    body("message_subject")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a subject longer than 2 characters"),
    body("message_body")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Please provide an appropriate description."),
  ]
}

/* ******************************
 * Check data and return errors or continue to new message
 * ***************************** */
validate.checkNewMessageData = async (req, res, next) => {
  const { message_subject, message_body, message_from } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let messageToSelect = await utilities.buildMessageToList(message_from)
    res.render("./messages/new-message", {
      errors,
      title: "New Message",
      nav,
      message_subject,
      message_body,
      messageToSelect: messageToSelect
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to reply message
 * ***************************** */
validate.checkReplyMessageData = async (req, res, next) => {
  const { message_subject, message_body, message_from } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let messageToSelect = await utilities.buildMessageToList(message_from)
    res.render("./messages/reply", {
      errors,
      title: "Reply Message",
      nav,
      message_subject,
      message_body,
      messageToSelect: messageToSelect
    })
    return
  }
  next()
}

module.exports = validate
