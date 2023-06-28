const utilities = require("../utilities/index")
const accModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 /* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccManagment(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(res.locals.accountData.account_id)
  const accountData = await accModel.getAccountById(account_id)
  const link = await utilities.accountTypeView(accountData)
  res.render("./account/management", {
    title: "Account Managment",
    nav,
    errors: null, 
    name: accountData.account_firstname,
    link
  })
}

 /* ****************************************
*  Deliver update view
* *************************************** */
async function buildAccUpdate(req, res, next) {
  const account_id = parseInt(res.locals.accountData.account_id)
  let nav = await utilities.getNav()
  const accountData = await accModel.getAccountById(account_id)
  res.render("./account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

/* ****************************************
*  Updates the account information
* *************************************** */
async function accountUpdate(req, res, next) {
  const account_id = parseInt(res.locals.accountData.account_id)
  let nav = await utilities.getNav()
  const accountData = await accModel.getAccountById(account_id)
  const {
    account_firstname,
    account_lastname,
    account_email,
  } = parseInt(res.locals.accountData)
  console.log(accountData.account_id)

  const updateResult = await accModel.accountUpdate(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )
  console.log(updateResult)

  if (updateResult) {
    req.flash("notice", `The account was successfully updated.`)
    res.redirect("/update/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }
}

/* ****************************************
*  Changes the password
* *************************************** */
async function passwordChange(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
    res.status(500).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  }

  const regResult = await accModel.passwordChange(
    hashedPassword
  )

  if (regResult) {
    req.flash("notice", `The password was successfully updated.`)
    res.redirect("/update/")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  }
}

module.exports = { buildLogin, buildRegister, buildAccManagment, registerAccount, accountLogin, buildAccUpdate, accountUpdate, passwordChange }