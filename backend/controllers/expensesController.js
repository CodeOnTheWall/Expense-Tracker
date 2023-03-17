// getting mongoose models
// Mongoose model provides an interface to the database for creating, querying, updating, deleting records
const Expense = require("../models/Expense");
const User = require("../models/User");

// get all notes, /notes - get, private access
const getAllExpenses = async (req, res) => {
  // find notes from MongoDB (using Model.find mongoose method)
  // dont need any methods so I can .lean - great for read only cases
  const expenses = await Expense.find().lean();

  // if no notes or theres notes but has no length
  if (!expenses?.length) {
    return res.status(400).json({ message: "No expenses found" });
  }

  // Add username to each note before sending the response
  // The Promise.all() method takes an iterable of promises as input and returns a single Promise, as an Array
  // hence notesWithUser will be an array of objects, each object being a note with an assigned user
  const expensesWithUser = await Promise.all(
    // map over notes
    expenses.map(async (expense) => {
      // find the User that has id of note.user (since note.user is an id from noteSchema)
      // heres the promise that will be returned into notesWithUser
      const user = await User.findById(expense.user).lean().exec();

      // return rest of expense (spread opp) (title, text, completed etc) and add a username to it
      // that username is the username from userSchema (after matching id's)
      return { ...expense, email: user.email };
    })
  );

  // .json converts the json to a js object to be read in the res (which i can see under /notes)
  res.json(expensesWithUser);
};

// create note, /notes - post, private access
const createNewExpense = async (req, res) => {
  // expect these values from req.body, as thats the noteSchema
  const { user, title, amount } = req.body;

  // Confirm data
  if (!user || !title || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate title
  const duplicate = await Expense.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate expense title" });
  }

  // Create and store the new note
  const expense = await Expense.create({ user, title, amount });

  if (expense) {
    // Created
    return res.status(201).json({ message: "New note created" });
  } else {
    return res.status(400).json({ message: "Invalid note data received" });
  }
};

// update note, /notes - patch, private access
const updateExpense = async (req, res) => {
  const { id, user, title, amount } = req.body;

  // Confirm data
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm note exists to update
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate expense title" });
  }

  expense.user = user;
  expense.title = title;
  expense.text = text;
  expense.completed = completed;

  const updatedExpense = await expense.save();

  res.json(`'${updatedExpense.title}' updated`);
};

// delete note, /notes - delete, private access
const deleteExpense = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  // Confirm note exists to delete
  const note = await Expense.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // deletes from collection
  const result = await note.deleteOne();

  const reply = `Note '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllExpenses,
  createNewExpense,
  updateExpense,
  deleteExpense,
};
