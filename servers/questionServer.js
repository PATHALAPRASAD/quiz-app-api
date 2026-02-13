const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  quizId: { type: Number, required: true },
  quizCategoryId: { type: Number, required: true },
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
});

const Question = mongoose.model("questions", questionSchema);

router
  .route("/")
  .post(async (req, res) => {
    try {
      const newQuestion = new Question({ ...req.body });
      const addedQuestion = await newQuestion.save();
      res.send(addedQuestion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .get(async (req, res) => {
    try {
      const allQuestions = await Question.find();
      res.status(201).json(allQuestions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const questionById = await Question.findOne({ id });
      console.log({ questionById });
      if (questionById) {
        res.send(questionById);
      } else {
        res.send({ errorMessage: `Question not found with id: ${id}` });
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
      const updatedQuestion = await Question.findOneAndUpdate(
        { id },
        updates,
        options,
      );
      console.log({ updatedQuestion });
      res.send(updatedQuestion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deletedQuestion = await Question.findOneAndDelete({ id });
      console.log({ deletedQuestion });
      res.send(deletedQuestion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.get("/distinct/quiz-ids", async (req, res) => {
  try {
    const allQuizIds = await Question.distinct("quizId");
    console.log({ allQuizIds });
    if (allQuizIds.length > 0) {
      res.status(201).json(allQuizIds);
    } else {
      res.send({
        errorMessage: "There are no quizzes",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/byQuizId/:quizId", async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const allQuestionsByQuizId = await Question.find({ quizId });
    if (allQuestionsByQuizId.length > 0) {
      res.status(201).json(allQuestionsByQuizId);
    } else {
      res.send({
        errorMessage: `There are no questions found for Quiz ID: ${quizId}`,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/distinct/quiz-ids-by-tech-id/:id", async (req, res) => {
  try {
    const quizCategoryId = parseInt(req.params.id);
    const allQuizIdsByQuizCategoryId = await Question.distinct("quizId", {
      quizCategoryId,
    });
    console.log({ allQuizIdsByQuizCategoryId });
    if (allQuizIdsByQuizCategoryId.length > 0) {
      res.status(201).json(allQuizIdsByQuizCategoryId);
    } else {
      res.status(200).send(
        [],
        //   {
        //   errorMessage: `There are no quizzes for quizCategoryId : ${quizCategoryId}`,
        // }
      );
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
