const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const User = mongoose.model("users", userSchema);

router
  .route("")
  .post(async (req, res) => {
    try {
      const newUser = new User({ ...req.body });
      const addedUser = await newUser.save();
      res.send(addedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .get(async (req, res) => {
    try {
      const allUsers = await User.find();
      res.status(201).json(allUsers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.route("/abc").get(async (req, res) => {
  try {
    const allUsers = await User.distinct("role");
    res.status(201).json(allUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/by-name/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const allUsers = await User.findOne({ name });
    res.send(allUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userById = await User.findOne({ id });
      console.log({ userById });
      if (userById) {
        res.send(userById);
      } else {
        res.send({ errorMessage: `User not found with id: ${id}` });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .put(async (req, res) => {
    try {
      const updates = { ...req.body };
      const options = { new: true };
      const id = parseInt(req.params.id);
      const updatedUser = await User.findOneAndUpdate({ id }, updates, options);
      console.log({ updatedUser });
      res.send(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deletedUser = await User.findOneAndDelete({ id });
      console.log({ deletedUser });
      res.send(deletedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.post("/authenticate", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password, role } = req.body;
    const userByEmail = await User.findOne({ email });
    console.log({ userByEmail });
    if (userByEmail) {
      if (userByEmail.role === role) {
        if (userByEmail.password === password) {
          res.send({ isLoggedIn: true });
        } else {
          res.send({ isLoggedIn: false, errorMessage: "Incorrect password" });
        }
      } else {
        res.send({
          isLoggedIn: false,
          errorMessage: `${userByEmail.name} is an ${userByEmail.role}. But trying to login as ${role}.`,
        });
        // "Incorrect role"
      }
    } else {
      res.send({ isLoggedIn: false, errorMessage: "Incorrect email" });
    }
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
