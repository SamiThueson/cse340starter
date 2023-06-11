const invModel = require("../models/inventory_model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getOneInventory(inv_id)
  const grid = await utilities.buildInventoryGrid(data)
  let nav = await utilities.getNav()
  const invTitle = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/one-car", {
    title: invTitle,
    nav,
    grid,
  })
}

/* ****************************************
*  Deliver management view
* *************************************** */
invCont.buildManagment = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Build Add Classification View
* *************************************** */
invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  console.log("build classification view")
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Add New Classification View
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addClassification(
    classification_name
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, the ${classification_name} classification was successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      // errors: null,

    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      // errors: null,
    })
  }
}

/* ****************************************
*  Build Add Inventory View
* *************************************** */
invCont.buildInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let option = await utilities.getClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
    option,
  })
}

/* ****************************************
*  Add New Inventory 
* *************************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let option = await utilities.getClassificationList()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const regResult = await invModel.addInventory(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, the ${inv_make} car was successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,

    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      // errors: null,
      option,
    })
  }
}

invCont.intentionalError = async function (req, res, next) {
  let nav = await utilities.getNav()
  if (nav) {
    throw new Error('Intentional error');
  }
  res.render("./errors/errors", {
    title: "Intentional Error",
    nav,
  })
}

module.exports = invCont