// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const invController = require("../controllers/invController")
const regValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));
router.get("/", utilities.handleErrors(invController.buildManagment));

router.get("/add-classification", utilities.handleErrors(invController.buildClassification));
router.post("/add-classification",
  regValidate.classificationRules(),
  regValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
);

router.get("/add-inventory", utilities.handleErrors(invController.buildInventory));
router.post("/add-inventory",
  regValidate.inventoryRules(),
  regValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
);

router.get('/trigger-error', utilities.handleErrors(invController.intentionalError));
// router.get('/broken', utilities.handleErrors(invController.throwError));

module.exports = router;