const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
router.use(authController.protect);
router.patch("/updatePassword", authController.updatePassword);
router.get("/loadUser", userController.getMe, userController.getOneUser);
router.patch("/me", userController.updateMe);
router.delete("/me", userController.deleteMe);
router.use(authController.restrictTo("admin"));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .patch(userController.updateUser)
  .delete(userController.deleteUser)
  .get(userController.getOneUser);
module.exports = router;
