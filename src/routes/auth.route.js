const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

router.post("/login", AuthController.login); // Iniciar sesión
router.get("/info", AuthController.getInfoCookie);
module.exports = router;
