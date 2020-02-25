const User = require("../models/users");

const Post = require("../models/posts");

const fileSystem = require("fs");

exports.create_post = (req, res, next) => {
  User.findById(req.body.user)
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "There is no user with that ID" });
      } else {
        if (req.file.filename != null) {
          const image = req.file.filename;
          const post = new Post({
            user: req.body.user,
            title: req.body.title,
            image: image,
            shorttext: req.body.shorttext,
            longtext: req.body.longtext
          });
          Post.save()
            .then(response =>
              res.status(200).json({
                message: "Successfully Created",
                post: response
              })
            )
            .catch(err => res.status(401).json({ error: err.message }));
        } else {
          const image = "none.jpg";
          const post = new Post({
            user: req.body.user,
            title: req.body.title,
            image: image,
            shorttext: req.body.shorttext,
            longtext: req.body.longtext
          });
          Post.save()
            .then(response =>
              res.status(200).json({
                message: "Successfully Created",
                post: response
              })
            )
            .catch(err => res.status(401).json({ error: err.message }));
        }
      }
    })
    .catch(err => res.status(404).json({ error: err.message }));
};

exports.get_posts = (req, res, next) => {
  Post.find()
    .populate("user", "username")
    .then(response =>
      res.status(200).json({
        message: "Successfully Fetched",
        count: response.length,
        posts: response.map(post => {
          return {
            id: post._id,
            user: post.user,
            title: post.title,
            link: "http://localhost:8000/api/posts/" + post._id
          };
        })
      })
    )
    .catch(err => res.status(401).json({ error: err.message }));
};

exports.get_post_by_id = (req, res, next) => {
  Post.findById(req.params.id)
    .populate("user", "username")
    .then(response => {
      if (response) {
        res.status(200).json(response);
      } else {
        res.status(401).json({ error: "There is no post with that ID" });
      }
    })
    .catch(err => res.status(401).json({ error: err.message }));
};

exports.update_post = (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, post)
    .then(response => {
      if (response.image != "none.jpg" && req.file.filename != null) {
        try {
          fileSystem.unlinkSync("./src/assets/uploads/" + req.file.filename);
        } catch (error) {
          res.status(401).json({ error: error });
        }
      }
      let image = null;
      if (req.file.filename != null) {
        image = req.file.filename;
      } else {
        image = "none.jpg";
      }
      const post = new Post({
        user: req.body.user,
        title: req.body.title,
        image: image,
        shorttext: req.body.shorttext,
        longtext: req.body.longtext
      });
      Post.save()
        .then(post =>
          res.status(200).json({
            message: "Successfully Updated",
            post: post
          })
        )
        .catch(err => res.status(401).json({ error: err.message }));
    })
    .catch(err => res.status(401).json({ error: err.message }));
};

exports.delete_post = (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
    .then(response => {
      try {
        fileSystem.unlinkSync("./src/assets/uploads/" + response.image);
        res.status(200).json({
          message: "Successfully Deleted",
          post: response
        });
      } catch (error) {
        res.status(401).json({ error: error });
      }
    })
    .catch(err => res.status(401).json({ error: err.message }));
};
