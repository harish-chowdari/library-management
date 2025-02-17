const mongoose = require("mongoose");
const moment = require("moment");

const ItemSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Books",
      required: true,
    },
    createdDate: {
      type: Date,
      default: () => moment.utc().startOf("day").toDate(),
    },
  },
);

const EmailsSentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [ItemSchema],
    createdDate: {
      type: Date,
      default: () => moment.utc().startOf("day").toDate(),
    }
  },
  
);

module.exports = mongoose.model("Email", EmailsSentSchema);



