// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const invController = require("../controllers/invController")
const regValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));

// Routes to build add classification view and add a classification
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildClassification));
router.post("/add-classification",
  regValidate.classificationRules(),
  regValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
);

// Routes to build add inventory view and add an inventory item
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildInventory));
router.post("/add-inventory",
  regValidate.inventoryRules(),
  regValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
);

// Route for building inventory management view
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildInvManagment));

// Route for building inventory view by classification
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route for building edit inventory view
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView));
router.post("/update/",
  regValidate.inventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route for building delete inventory view
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventoryView));
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

router.get('/trigger-error', utilities.handleErrors(invController.intentionalError));
// router.get('/broken', utilities.handleErrors(invController.throwError));

module.exports = router;