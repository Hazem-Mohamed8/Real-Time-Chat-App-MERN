const { Router } = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  searchContacts,
  getContactsForDMList,
  getAllContacts,
} = require("../controller/contactsController");

const contactsRouter = Router();

contactsRouter.post("/search", verifyToken, searchContacts);
contactsRouter.get("/get-contacts", verifyToken, getContactsForDMList);
contactsRouter.get("/get-all-contacts", verifyToken, getAllContacts);

module.exports = contactsRouter;
