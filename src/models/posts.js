const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    title: { type: String, required: true },
    image: { type: String },
    shorttext: { type: String, required: true },
    longtext: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", postSchema);
