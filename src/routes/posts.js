const express = require("express");

const router = express.Router();

const authentication = require("../auth/auth");

const upload = require("../multer/multer");

const PostController = require("../controllers/posts");

router.post(
  "/",
  authentication,
  upload.single("image"),
  PostController.create_post
);

router.get("/", authentication, PostController.get_posts);

router.get("/:id", authentication, PostController.get_post_by_id);

router.put(
  "/:id",
  authentication,
  upload.single("image"),
  PostController.update_post
);

router.delete("/:id", authentication, PostController.delete_post);

module.exports = router;
