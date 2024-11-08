const { Router } = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  searchContacts,
  getContactsForDMList,
} = require("../controller/contactsController");

const contactsRouter = Router();

contactsRouter.post("/search", verifyToken, searchContacts);
contactsRouter.get("/get-contacts", verifyToken, getContactsForDMList);

module.exports = contactsRouter;
