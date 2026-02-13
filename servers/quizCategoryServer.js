const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const quizCategorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  tech: { type: String, required: true },
});

const QuizCategory = mongoose.model("quiz-categories", quizCategorySchema);

router
  .route("/")
  .post(async (req, res) => {
    try {
      const newQuizCategory = new QuizCategory({ ...req.body });
      const addedQuizCategory = await newQuizCategory.save();
      res.send(addedQuizCategory);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .get(async (req, res) => {
    try {
      const allQuizCategoryzes = await QuizCategory.find();
      res.status(201).json(allQuizCategoryzes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quizCategoryById = await QuizCategory.findOne({ id });
      console.log({ quizCategoryById });
      if (quizCategoryById) {
        res.send(quizCategoryById);
      } else {
        res.send({ errorMessage: `Quiz Category not found with id: ${id}` });
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
      const updatedQuizCategory = await QuizCategory.findOneAndUpdate(
        { id },
        updates,
        options,
      );
      console.log({ updatedQuizCategory });
      res.send(updatedQuizCategory);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deletedQuizCategory = await QuizCategory.findOneAndDelete({ id });
      console.log({ deletedQuizCategory });
      res.send(deletedQuizCategory);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
