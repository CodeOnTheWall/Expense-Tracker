const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  user: {
    // what type of data this is (objectId) and its from another schema
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    //   this is referring to which schema, the User schema
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  // false to start because when i create a new note, it will be open and not completed
  date: {
    type: Date,
    default: Date.now,
  },
});

// will auto be expenses in mongodb
module.exports = mongoose.model("Expense", expenseSchema);
