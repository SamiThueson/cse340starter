const messModel = require("../models/message_model")
const accModel = require("../models/account-model")
const utilities = require("../utilities/")

const messCont = {}

/* ****************************************
*  Deliver message inbox view
* *************************************** */
messCont.buildMessageInbox = async function (req, res, next) {
  let nav = await utilities.getNav()
  // const count = await messModel.countArchivedMessages(res.locals.accountData.account_id)
  // const countArchivedMessages = count.rows[0].count
  // console.log(countArchivedMessages)

  const data = await messModel.getNotArchivedMessage(res.locals.accountData.account_id)
  const grid = await utilities.buildInboxGrid(data)
  const accountName = `${res.locals.accountData.account_firstname} ${res.locals.accountData.account_lastname}`
  res.render("./messages/inbox", {
    title: accountName + " Inbox",
    nav,
    errors: null,
    grid,
    // accountData: res.locals.accountData,
    // countArchivedMessages,
    // archive
  })
}

/* ****************************************
*  Deliver new message view
* *************************************** */
messCont.buildNewMessage = async function (req, res, next) {
  let nav = await utilities.getNav()
  const messageToSelect = await utilities.buildMessageToList()
  res.render("./messages/new-message", {
    title: "New Message",
    nav,
    errors: null,
    messageToSelect
  })
}

/* ****************************************
*  Deliver archived messages view
* *************************************** */
messCont.buildArchivedMessage = async function (req, res, next) {
  let nav = await utilities.getNav()
  const data = await messModel.getArchivedMessage(res.locals.accountData.account_id)
  const grid = await utilities.buildInboxGrid(data)
  const accountName = `${res.locals.accountData.account_firstname} ${res.locals.accountData.account_lastname}`
  res.render("./messages/archived", {
    title: accountName + " Archives",
    nav,
    errors: null,
    grid
  })
}

/* ****************************************
*  Add New Message controller
* *************************************** */
messCont.addNewMessage = async function (req, res, next) {
  let nav = await utilities.getNav()
  const messageToSelect = await utilities.buildMessageToList()
  const data = await messModel.getMessageTo(res.locals.accountData.account_id)
  const grid = await utilities.buildInboxGrid(data)

  const { 
    message_subject,
    message_body,
    message_to,
    message_from 
  } = req.body
  console.log(req.body)

  const regResult = await messModel.addNewMessage(
    message_subject,
    message_body,
    message_to,
    message_from
  )

  const accountName = `${res.locals.accountData.account_firstname} ${res.locals.accountData.account_lastname}`

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, the message was sent.`
    )
    res.status(201).render("messages/inbox", {
      title: accountName + " Inbox",
      nav,
      grid
      // errors: null,
    })
  } else {
    req.flash("notice", "Sorry, sending a new message failed.")
    res.status(501).render("messages/new-message", {
      title: "New Message",
      nav,
      // errors: null,
      messageToSelect
    })
  }
}

/* ***************************
 *  Build message by message_id view
 * ************************** */
messCont.buildByMessageId = async function (req, res, next) {
  const message_id = parseInt(req.params.message_id)
  const data = await messModel.getMessageById(message_id)
  const grid = await utilities.buildMessageGrid(data)

  let nav = await utilities.getNav()
  const messName = data[0].message_subject
  res.render("./messages/show-message", {
    title: messName,
    nav,
    grid,
    errors: null,
    message_id
  })
}

/* ***************************
 *  Build message reply view
 * ************************** */
messCont.buildReplyMessage = async function (req, res, next) {
  const message_id = parseInt(req.params.message_id)
  const data = await messModel.getMessageById(message_id)
  const messageToSelect = await utilities.buildMessageToList(data[0].message_from)
  let nav = await utilities.getNav()
  res.render("./messages/reply", {
    title: "Reply Message",
    nav,
    messageToSelect: messageToSelect,
    errors: null,
    message_subject: "RE: " + data[0].message_subject,
    message_body: `//////// Previous Message ////////
    ${data[0].message_body}`,

  })
}

/* ***************************
 *  Mark message read as true
 * ************************** */
messCont.markMessageRead = async function (req, res, next) {
  const {
    message_id,
  } = req.body

  // This doesn't work either
  // const message_id = parseInt(req.params.inv_id)

  console.log(message_id)
  const updateResult = await messModel.updateReadMessage(
    message_id,  
  )
  if (updateResult) {
    req.flash("notice", "The message was successfully updated to read.")
    res.redirect("/message/")
  } else {
    req.flash("notice", "Sorry, marking the message as read failed.");
    res.redirect("/message");
  }
}

/* ***************************
 *  Mark message as archived
 * ************************** */
messCont.markMessageArchived = async function (req, res, next) {
  const {
    message_id,
  } = req.body

  // This doesn't work either
  // const message_id = parseInt(req.params.inv_id)

  console.log(message_id)
  const updateResult = await messModel.updateArchiveMessage(
    message_id,  
  )
  if (updateResult) {
    req.flash("notice", "The message was successfully updated to archived.")
    res.redirect("/message/")
  } else {
    req.flash("notice", "Sorry, the message failed to be marked as archived.");
    res.redirect("/message");
  }
}

/* ***************************
 *  Delete Message Data
 * ************************** */
messCont.deleteMessage = async function (req, res, next) {
  const {
    message_id,
  } = req.body

  // This doesn't work either
  // const message_id = parseInt(req.params.inv_id)

  console.log(message_id)
  const updateResult = await messModel.deleteMessage(
    message_id,  
  )
  if (updateResult) {
    req.flash("notice", "The message was successfully deleted.")
    res.redirect("/message/")
  } else {
    req.flash("notice", "Sorry, the message failed to be deleted.");
    res.redirect("/message");
  }
}


module.exports = messCont