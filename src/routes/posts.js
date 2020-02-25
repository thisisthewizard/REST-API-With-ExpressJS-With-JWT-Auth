const express = require("express");

const router = express.Router();

const authentication = require("../auth/auth");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/assets/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const filter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024
  },
  fileFilter: filter
});

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
