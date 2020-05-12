const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const cors = require("cors");

const users = require("./routes/users");

const posts = require("./routes/posts");

// App Is Using
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors());

app.use("/api/users", users);

app.use("/api/posts", posts);

app.use((req, res, next) => {
  res.status(401).json({
    error: {
      message: "There is no method in this route!!!"
    }
  });
});

require("dotenv").config();

mongoose.connect(
  process.env.MONGO_DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  () => {
    console.log("Mongoose has been successfully connected!!!");
  }
);

mongoose.Promise = global.Promise;

module.exports = app;
