const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accController.buildLogin));
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.accountLogin)
)

router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildAccManagment));

router.get("/register", utilities.handleErrors(accController.buildRegister));
router.post(
  "/register", 
  regValidate.registationRules(), 
  regValidate.checkRegData, 
  utilities.handleErrors(accController.registerAccount)
);

router.get("/update/", utilities.handleErrors(accController.buildAccUpdate));
router.post("/update/", 
  regValidate.registationRules(), 
  regValidate.checkUpdateData,
  utilities.handleErrors(accController.accountUpdate)
);
router.post("/update/", 
  regValidate.registationRules(), 
  // regValidate.checkUpdateData,
  utilities.handleErrors(accController.passwordChange)
);

router.get('/logout', utilities.logout);

module.exports = router;