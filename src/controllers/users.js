const User = require("../models/users");

const Post = require("../models/posts");

const bcrypt = require("bcrypt");

const JWT = require("jsonwebtoken");

require("dotenv").config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

JWTToken = user => {
  return JWT.sign(
    {
      iss: "The-Wizard",
      sub: user._id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
    },
    ACCESS_TOKEN
  );
};

exports.register = (req, res, next) => {
  let username = req.body.username.toLowerCase();
  let mobile = req.body.mobile.toLowerCase();
  let email = req.body.email.toLowerCase();
  User.find({ mobile: mobile }).then((user) => {
    if (user.length >= 1) {
      return res
        .status(401)
        .json({ error: "There is an user with that mobile no!!!" });
    } else {
      User.find({ username: username }).then((user) => {
        if (user.length >= 1) {
          return res
            .status(401)
            .json({ error: "There is an user with that username!!!" });
        } else {
          User.find({ email: email }).then((user) => {
            if (user.length >= 1) {
              return res
                .status(401)
                .json({ error: "There is an user with that email ID" });
            } else {
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  return res.status(401).json({ error: err.message });
                } else {
                  const user = {
                    email: email,
                    username: username,
                    fullname: req.body.fullname,
                    mobile: mobile,
                    password: hash,
                  };
                  User.create(user)
                    .then((response) => {
                      Role.create({ user: response._id });
                      Permission.create({ user: response._id });
                      res.status(200).json({
                        message: "Successfully Created",
                        user: response,
                      });
                    })
                    .catch((err) =>
                      res.status(401).json({ error: err.message })
                    );
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.login = (req, res, next) => {
  let email = req.body.email.toLowerCase();
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ error: "There is no User with that E-mail ID" });
      }
      bcrypt.compare(req.body.password, user.password, (err, response) => {
        if (err) {
          return res.status(401).json({ error: "The Password Is Incorrect" });
        }
        if (response) {
          const token = JWTToken(user);
          return res.status(200).json({ token: token });
        }
        return res.status(401).json({ error: "The Password Is Incorrect" });
      });
    })
    .catch((err) => res.status(401).json({ error: err.message }));
};

exports.get_auth_data = (req, res, next) => {
  User.findById(req.user.sub)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => res.status(401).json({ error: err.message }));
};

exports.get_all_user = (req, res, next) => {
  User.find()
    .then(response =>
      res.status(200).json({
        message: "Successfully Fetched",
        count: response.length,
        users: response.map(user => {
          return {
            id: user._id,
            username: user.username,
            fullname: user.fullname,
            mobile: user.mobile,
            email: user.email,
            posts: "http://localhost:8000/api/users/posts/" + user._id
          };
        })
      })
    )
    .catch(err => res.status(401).json({ error: err.message }));
};

exports.get_user_by_id = (req, res, next) => {
  User.findById(req.params.id)
    .then(response => {
      if (response) {
        res.status(200).json({
          message: "Successfully Fetched",
          count: response.length,
          user: {
            id: response._id,
            username: response.username,
            fullname: response.fullname,
            mobile: response.mobile,
            email: response.email,
            posts: "http://localhost:8000/api/users/posts/" + response._id
          }
        });
      } else {
        res.status(401).json({ error: "There is no User with that ID" });
      }
    })
    .catch(err => res.status(401).json({ error: err.message }));
};

exports.get_posts_by_user = (req, res, next) => {
  User.findById(req.params.id)
    .then(user =>
      Post.find({ user: req.params.id })
        .then(response => {
          if (response) {
            res.status(200).json({
              message: "Successfully Fetched",
              user: user.username,
              count: response.length,
              posts: response.map(post => {
                return {
                  _id: post._id,
                  title: post.title,
                  image: post.image,
                  shorttext: post.shorttext,
                  longtext: post.longtext,
                  post: "http://localhost:8000/api/posts/" + post._id
                };
              })
            });
          } else {
            res.status(401).json({ error: "There is no User with that ID" });
          }
        })
        .catch(err => res.status(401).json({ error: err.message }))
    )
    .catch(err => res.status(401).json({ error: err.message }));
};

exports.update_user_data = (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then(response =>
      res.status(200).json({
        message: "Successfully Updated",
        user: response
      })
    )
    .catch(err => res.status(401).json({ error: err.message }));
};

exports.delete_user = (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then(response =>
      res.status(200).json({
        message: "Successfully Deleted",
        user: response
      })
    )
    .catch(err => res.status(401).json({ error: err.message }));
};
