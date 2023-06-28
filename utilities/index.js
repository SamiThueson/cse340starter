const { render } = require("ejs")
const invModel = require("../models/inventory_model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  }) 
  list += "</ul>"
  return list
}

/* ************************
 * Constructs the classification HTML select list
 ************************** */
Util.buildClassificationList = async function (optionSelected) {
  let data = await invModel.getClassifications()
  let option = '<option value="">Choose a Classification</option>'
  data.rows.forEach((row) => {
    option += 
      `<option value="${row.classification_id}" 
      ${row.classification_id === Number(optionSelected)? 'selected':''}>
      ${row.classification_name}
      </option>`
  })
  return option
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory id view HTML
* ************************************ */
Util.buildInventoryGrid = async function(data){
  let grid
  if(data.length > 0){
    data.forEach(vehicle => {
      grid = '<div class="inv-display">'
      grid +=  '<p><img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></p>'
      grid += '<div class="car-description">'
      grid += '<table>'
      grid += '<tr><h3 class="veh-detail">'+ vehicle.inv_make + ' ' + vehicle.inv_model +' Details</tr></h3>'
      grid += '<tr><td>Price: $' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</td></tr>'
      grid += '<tr><td>Description: ' + vehicle.inv_description + '</td></tr>'
      grid += '<tr><td>Color: ' + vehicle.inv_color + '</td></tr>'
      grid += '<tr><td>Mileage: ' + vehicle.inv_miles.toLocaleString("en-US") + '</td></tr>'
      grid += '</table>'
      grid += '</div>'
      grid += '</div>'
    })
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Check Account Type
 * ************************************ */
 Util.accountTypeView = async function (accountData) {
  let link
  if (accountData.account_type == "Admin") {
    link = '<h3>Inventory Management</h3>'
    link += '<p><a href="/inv/">Manage Inventory</a></p>'
  } else if (accountData.account_type == "Employee") {
    link = '<h3>Inventory Management</h3>'
    link += '<p><a href="/inv/">Manage Inventory</a></p>'
  }
  return link
 }

 /* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkAccountType = (req, res, next) => {
  try {
    const decodedToken = jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET);

    const accountType = decodedToken.account_type;

    if (accountType !== 'Employee' && accountType !== 'Admin') {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
    }
    next();
  } catch (error) {
    req.flash("Please log in")
    res.clearCookie("jwt")
    return res.redirect("/account/login")
  }
 }

 Util.logout = (req, res, next) => {
  res.clearCookie("jwt")
  return res.redirect("/")
 }

module.exports = Util