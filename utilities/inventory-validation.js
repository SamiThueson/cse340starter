const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification name is required and must be string
    body("classification_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a correct classification name."), // on error this message is sent.
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
      .isLength({ min: 2 })
      .withMessage("Please provide a correct make name."),
    body("inv_model")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a correct model name."),
    body("inv_description")
      .trim()
      .isLength({ min: 2 })
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
      .isLength({ max: 4})
      .withMessage("Please provide the correct year."),
    body("inv_miles")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide the correct miles."),
    body("inv_color")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a correct color."),
    body("classification_id")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a correct classification name."), // on error this message is sent.
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
      inv_color
    })
    return
  }
  next()
}

module.exports = validate
