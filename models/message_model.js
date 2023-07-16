const pool = require("../database")

const messModel = {}

/* *****************************
* Return message data using the message id
* ***************************** */
messModel.getMessageById = async function (message_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.message WHERE message_id = $1",
      [message_id]
    )
    return data.rows
  } catch (error) {
    console.error("getmessagebyid error" + error)
  }
}

/* *****************************
* Return message data using the message to
* ***************************** */
messModel.getMessageTo = async function (message_to) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.message WHERE message_to = $1",
      [message_to]
    )
    return data.rows
  } catch (error) {
    console.error("getmessageto error" + error)
    return new Error("No matching message found")
  }
}

/* *****************************
* Return message data using the message to and whether it's archived or not
* ***************************** */
messModel.getNotArchivedMessage = async function (message_to) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.message WHERE message_to = $1 AND message_archived = 'false'",
      [message_to]
    )
    return data.rows
  } catch (error) {
    console.error("getnotarchivedmessage error" + error)
    return new Error("No matching message found")
  }
}

/* *****************************
* Return only archived messages
* ***************************** */
messModel.getArchivedMessage = async function (message_to) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.message WHERE message_to = $1 AND message_archived = 'true'",
      [message_to]
    )
    return data.rows
  } catch (error) {
    console.error("getarchivedmessage error" + error)
    return new Error("No matching message found")
  }
}

/* *****************************
* Return message data using the message from
* ***************************** */
messModel.getMessageFrom = async function (message_from) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.message WHERE message_from = $1",
      [message_from]
    )
    return data.rows
  } catch (error) {
    console.error("getmessagefrom error" + error)
    return new Error("No matching message found")
  }
}

/* *****************************
* Return message data using the message from
* ***************************** */
messModel.countUnreadMessages = async function (message_to) {
  try {
    const data = await pool.query(
      "SELECT message_read FROM public.message WHERE message_to = $1 AND message_read = 'false'",
      [message_to]
    )
    return data.rows[0]
  } catch (error) {
    console.error("countunreadmessages error" + error)
  }
}

/* *****************************
* Return message data using the message from
* ***************************** */
messModel.countArchivedMessages = async function (message_to) {
  try {
    const data = await pool.query(
      "SELECT message_archived FROM public.message WHERE message_to = $1 AND message_archived = 'true'",
      [message_to]
    )
    return data.rows
  } catch (error) {
    console.error("countarchivedmessages error" + error)
  }
}

/* ***************************
 *  Add a New Message
 * ************************** */
messModel.addNewMessage = async function (message_subject, message_body, message_to, message_from) {
  try {
    const sql = "INSERT INTO message (message_subject, message_body, message_to, message_from) VALUES ($1, $2, $3, $4) RETURNING *"
    return await pool.query(sql, [message_subject, message_body, message_to, message_from])
  } catch (error) {
    // console.error("addnewmessage error" + error)
    return error.message
  }
}

/* ***************************
 *  Update mark as read to true
 * ************************** */
messModel.updateReadMessage = async function (message_id) {
  try {
    const sql =
      "UPDATE public.message SET message_read='true' WHERE message_id = $1 RETURNING *"
    const data = await pool.query(sql, [
      message_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Update to Archived Message
 * ************************** */
messModel.updateArchiveMessage = async function (message_id) {
  try {
    const sql =
      "UPDATE public.message SET message_archived='true' WHERE message_id = $1 RETURNING *"
    const data = await pool.query(sql, [
      message_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete a message
 * ************************** */
messModel.deleteMessage = async function (message_id) {
  try {
    const sql = 'DELETE FROM public.message WHERE message_id = $1'
    const data = await pool.query(sql, [message_id])
  return data
  } catch (error) {
    throw new Error("Delete Message Error")
  }
}

module.exports = messModel