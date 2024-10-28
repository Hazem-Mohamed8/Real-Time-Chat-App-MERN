const { Router } = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { searchContacts } = require("../controller/contactsController");

const contactsRouter = Router();

contactsRouter.post("/search", verifyToken, searchContacts);

module.exports = contactsRouter;
