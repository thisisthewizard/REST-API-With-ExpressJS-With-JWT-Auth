const express = require("express");

const router = express.Router();

const authentication = require("../auth/auth");

const UserController = require("../controllers/users");

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.get("/data", authentication, UserController.get_auth_data);

router.get("/", authentication, UserController.get_all_user);

router.get("/:id", authentication, UserController.get_user_by_id);

router.get("/posts/:id", authentication, UserController.get_posts_by_user);

router.put("/:id", authentication, UserController.update_user_data);

router.delete("/:id", authentication, UserController.delete_user);

module.exports = router;
