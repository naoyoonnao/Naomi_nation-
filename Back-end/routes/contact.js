const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/contactController");

// POST /api/contact
router.post("/", sendMessage);

module.exports = router;
