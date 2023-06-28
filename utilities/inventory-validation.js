const utilities = require(".")
const invModel = require("../models/inventory_model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification name is required and must be a string
    body("classification_name")
      .trim()
      .isAlpha()
      .withMessage("Please provide a classification name that is only letters and no spaces.")
      .isLength({ min: 3 })
      .withMessage("Please provide a classification name at least 3 characters."), // on error this message is sent.
  ]
}

/* ******************************
 * Check data and return errors or continue to classifcation
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isAlpha()
      .withMessage("Please provide a make name that is only letters and no spaces.")
      .isLength({ min: 3 })
      .withMessage("Please provide a make name at least 3 characters."),
    body("inv_model")
      .trim()
      .isAlpha()
      .withMessage("Please provide a model name that is only letters and no spaces.")
      .isLength({ min: 3 })
      .withMessage("Please provide a model name at least 3 characters."),
    body("inv_description")
      .isLength({ min: 5 })
      .withMessage("Please provide a correct description."),
    body("inv_image")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a correct image path."),
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a correct thumbnail path."),
    body("inv_price")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a correct price."),
    body("inv_year")
      .trim()
      .isNumeric()
      .isLength({ max: 4})
      .withMessage("Please provide the correct year."),
    body("inv_miles")
      .trim()
      .isNumeric()
      .withMessage("Please provide the correct miles."),
    body("inv_color")
      .trim()
      .escape()
      .isAlpha()
      .withMessage("Please provide a correct color."),
  ]
}

/* ******************************
 * Check data and return errors or continue to inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      inv_make,
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color,
      classificationSelect
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to inventory update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList()
    const itemData = await invModel.getInventoryById(inv_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      inv_make,
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color,
      inv_id,
      classificationSelect
    })
    return
  }
  next()
}

module.exports = validate
