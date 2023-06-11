const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accController.buildLogin));
router.get("/register", utilities.handleErrors(accController.buildRegister));
router.post(
  "/register", 
  regValidate.registationRules(), 
  regValidate.checkRegData, 
  utilities.handleErrors(accController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  (req, res) => {
    res.status(200).send('login process')
  }
  // utilities.handleErrors(accController.checkLogin)
)

module.exports = router;